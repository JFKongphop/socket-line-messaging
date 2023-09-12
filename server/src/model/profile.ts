import mongoose from "mongoose";

const ProfleSchema = new mongoose.Schema({
  userId: {
    require: true,
    type: String
  },
  displayName: {
    require: true,
    type: String
  },
  pictureUrl: {
    require: true,
    type: String
  },
  chats: [
    {
      timestamp: Number,
      message: String,
      sender: String
    },
  ],
  latestActive: {
    require: true,
    type: Number
  },
  latestOpenChat: {
    require: true,
    type: Number
  }
})

interface NewMessage {
  timestamp: number,
  message: string,
  sender: string
}

export const User = mongoose.model('User', ProfleSchema);

export const getAccountById = (userId: string) => User.findOne({ userId });

export const createAccount = async (
  data: Record<string, string | number | NewMessage[]>
) => {
  new User(data)
    .save()
    .then((user) => user.toObject());
}

export const updateChats = async (
  userId: string, 
  newMessage: NewMessage[], 
  latestActive: number
) => {
  await User.findOneAndUpdate(
    { userId },
    {
      $push: { chats: { $each: newMessage } },
      $set: { latestActive },
    },
    { new: true }
  );
};

export const getAllUsers = async () => await User.aggregate([
  {
    $project: {
      _id: 0,
      userId: 1,
      displayName: 1,
      pictureUrl: 1,
      chats: {
        $arrayElemAt: [
          {
            $map: {
              input: { $slice: ['$chats', -1] },
              as: 'chat',
              in: {
                timestamp: '$$chat.timestamp',
                message: '$$chat.message',
                sender: '$$chat.sender',
              },
            },
          },
          0,
        ],
      },
      latestActive: 1,
      latestOpenChat: 1,
    },
  },
  {
    $sort: {
      latestActive: -1,
    }
  }
]);

export const updateLatestOpenChat = (userId: string, latestOpenChat: number) => User.findOneAndUpdate({ userId }, { latestOpenChat });
