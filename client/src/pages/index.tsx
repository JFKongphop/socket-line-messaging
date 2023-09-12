import { 
  useEffect, 
  useState 
} from 'react'
import { useForm } from 'react-hook-form';
import { io } from "socket.io-client";

import LineRequest from '@/lib/line-request';

import ClientSideBar from '@/components/sidebar/ClientSideBar';
import ClientChat from '@/components/chat/ClientChat';

import type { AxiosResponse } from 'axios';
import type { 
  UseFormRegister, 
  SubmitHandler 
} from 'react-hook-form';
import type { 
  MessageSender, 
  PersonalChat, 
  PersonalChatIOResponse, 
  UserList 
} from '@/type/chat-type';

import { VITE_API_ENDPOINT } from '@/configs/enviroment';

const socket = io(VITE_API_ENDPOINT);

const defaultValues = {
  message: ''
}

const index = () => {
  const [userLists, setUserLists] = useState<UserList[]>([]);
  const [userId, setUserId] = useState<string>('');
  const [personalChats, setPersonalChats] = useState<PersonalChat[]>([]);
  const [latestChats, setLatestChats] = useState<PersonalChatIOResponse>();

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<MessageSender>({ defaultValues });

  useEffect(() => {
    socket.on('user-lists', (data: UserList[]) => {
      setUserLists(data);
    });
  }, []);


  useEffect(() => {
    socket.on('chat-message', (data: PersonalChatIOResponse) => {
      setLatestChats(data);
    });
  }, []);

  useEffect(() => {
    if (latestChats) {
      if (latestChats.userId === userId) {
        setPersonalChats((prevChat) => {
          return [...latestChats.chats, ...prevChat];
        })
      }
    }
  }, [latestChats]);

  const userChatHandler = async (userId: string) => {    
    socket.emit('join-room', userId);
    const { data }: AxiosResponse<{ chats: PersonalChat[] }> = await LineRequest.get(
      `/chat/${userId}`
    );

    setUserId(userId);
    setPersonalChats(data.chats);
  };

  const submitMessageHandler: SubmitHandler<MessageSender> = async ({ message }: MessageSender) => {
    if (message.length > 0 ) {
      const { status } = await LineRequest.post(
        `/send-message/${userId}`,
        { message }
      );
  
      if (status === 200) {
        const { data }: AxiosResponse<{ chats: PersonalChat[] }> = await LineRequest.get(
          `/chat/${userId}`
        );
        setPersonalChats(data.chats);
      }
    }

    reset(defaultValues);
  }

  const registerProps = register as unknown as UseFormRegister<MessageSender>;

  return (
    <div className="grid grid-cols-4 h-full">
      <ClientSideBar 
        userLists={userLists}
        onUserChatHandler={userChatHandler}
      />
      <ClientChat 
        userId={userId}
        personalChats={personalChats}
        register={registerProps}
        onSubmitMessageHandler={submitMessageHandler}
        handleSubmit={handleSubmit}
      />
    </div>
  )
}

export default index;
