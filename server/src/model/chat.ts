import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  userId: {
    require: true,
    type: String
  },
  chats: [
    {
      message: String,
      replyToken: String
    },
  ]
});

interface NewMessage {
  message: string,
  sender: string
}

export const Chat = mongoose.model('Chat', ChatSchema);

export const checkValidChat = (userId: string) => Chat.findOne({ userId });

export const createChat =  (data: Record<string, string | NewMessage[]>) => new Chat(data).save().then((user) => user.toObject());

export const updateChats = (userId: string, newMessage: NewMessage | NewMessage[]) => Chat.findOneAndUpdate({ userId }, { $push: { chats: newMessage }});
 
