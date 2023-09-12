export interface PersonalChat {
  timestamp: number,
  message: string,
  sender: 'admin' | 'user',
}

export interface UserList {
  chats: PersonalChat
  userId: string;
  displayName: string;
  pictureUrl: string;
  latestActive: number;
  latestOpenChat: number;
}

export interface MessageSender {
  message: string
}

export interface PersonalChatIOResponse {
  userId: string,
  chats: PersonalChat[]
}

