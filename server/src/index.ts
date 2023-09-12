import express, { json } from 'express';
import { 
  Client, 
  Profile, 
  middleware, 
} from '@line/bot-sdk';
import mongoose from 'mongoose';
import cors from 'cors';
import { 
  Server, 
  Socket 
} from 'socket.io';
import http from 'http';

import { 
  createAccount, 
  getAccountById, 
  getAllUsers, 
  updateChats, 
  updateLatestOpenChat
} from './model/profile';
import LineRequest from './lib/line-request';
import { handleMessage } from './lib/handle-mesage';

import { 
  ACCESS_TOKEN, 
  SECRET_TOKEN,
  MONGO_URI,
  FRONTEND_URL,
} from './environment';

import type { 
  Request, 
  Response 
} from 'express';
import type { 
  CustomRequest, 
  WebhookType 
} from './type/line-type';
import type { AxiosResponse } from 'axios';


const app = express();
app.use(cors({
  origin: FRONTEND_URL
}));

const server = http.createServer(app);

const lineConfig = {
  channelAccessToken: ACCESS_TOKEN,
  channelSecret: SECRET_TOKEN
}

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST']
  }
})

const client = new Client(lineConfig);

let socket: Socket;
io.on('connection', async (subSocket) => {
  socket = subSocket;
  socket.on('join-room', async (userId: string) => {
    socket.join(userId);

    await updateLatestOpenChat(userId, Date.now());
    const usersData = await getAllUsers();
    socket.emit('user-lists', usersData);
  });

  const usersData = await getAllUsers();
  socket.emit('user-lists', usersData);
});


app.get('/', (_, res: Response) => {
  return res.status(200).json({ message: 'api is running' })
})

app.post('/webhook', middleware(lineConfig), async (
  req: Request, 
  res: Response
) => {
  try {
    const events: WebhookType[] = req.body.events;
    const userId = events[0].source.userId

    const { data }: AxiosResponse<Profile> = await LineRequest.get(
      `/profile/${userId}`,
    );

    const timestamp = Date.now();
    const chats = events.map((data) => {
      return {
        timestamp,
        message: data.message.text,
        sender: 'user'
      }
    });

    const user = await getAccountById(userId);
    if (!user) {      
      await createAccount({
        userId,
        displayName: data.displayName,
        pictureUrl: data?.pictureUrl ? data.pictureUrl : 'https://res.cloudinary.com/dmhcnhtng/image/upload/v1664642479/992490_sskqn3.png',
        chats,
        latestActive: timestamp
      });
    }
    else {
      await updateChats(
        userId,
        chats,
        timestamp
      );
    }

    const usersData = await getAllUsers();
    socket.emit('chat-message', { chats, userId });
    socket.emit('user-lists', usersData);

    return events.map((item) => handleMessage(client, item));
  }

  catch {
    return res.status(500).end();
  }
});

app.get('/chat/:userId', async (
  req: CustomRequest<never, { userId: string }>, 
  res
) => {
  const { userId } = req.params;
  const user = await getAccountById(userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const chats = user.chats.reverse();

  return res.status(200).json({ chats });
});


app.get('/user-lists', async (req, res) => {
  const usersData = await getAllUsers();
  const users = usersData.map((data) => {
    return {
      userId: data.userId,
      displayName: data.displayName,
      pictureUrl: data.pictureUrl
    }
  });
  return res.status(200).json({ users });
})

app.post('/send-message/:userId', json(), async (
  req: CustomRequest<{ message: string }, { userId: string }>,
  res: Response
) => {
  try {
    const { message } = req.body;
    const { userId } = req.params;

    await LineRequest.post(
      '/message/push',
      {
        to: userId,
        messages:[
          {
            type: 'text',
            text: message
          }
        ]
      }
    );
    await updateChats(
      userId,
      [
        {
          timestamp: Date.now(),
          message,
          sender: 'admin'
        }
      ],
      Date.now(),
    );

    const usersData = await getAllUsers();
    socket.emit('user-lists', usersData);

    return res.status(200).json({ message: 'Message is send successfully' });
  }
  catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Server error'})
  }
});

mongoose.connect(MONGO_URI)
.then(() => {
  console.log('Connected to the database ')
})
.catch( (err) => {
  console.error(`Error connecting to the database. ${err}`);
});

server.listen(4000, () => {
  console.log(`Running at port 4000`);
});

