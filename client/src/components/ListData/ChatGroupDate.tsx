import { PersonalChat } from '@/type/chat-type';
import { FC } from 'react';
import ChatList from './ChatList';

interface IChatGroupDate {
  timestampsByDay: any;
  dayKeys: string;
}

const ChatGroupDate: FC<IChatGroupDate> = ({
  timestampsByDay,
  dayKeys
}) => {
  return (
    <div
      className="flex flex-col w-full gap-4"
    >
      <div 
        className="w-full flex justify-center bg-slate-800/10 rounded-md text-[10px] font-bold"
      >
        <p>{dayKeys}</p>
      </div>
      <div className="flex flex-col-reverse gap-1">
        {
          timestampsByDay[dayKeys].map((chat: PersonalChat) => (
            <ChatList
              timestamp={chat.timestamp}
              sender={chat.sender}
              message={chat.message}
            />
          ))
        }
      </div>
    </div>
  )
}

export default ChatGroupDate;