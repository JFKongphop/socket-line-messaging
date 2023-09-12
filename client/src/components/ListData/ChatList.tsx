import { convertTimestampToTime } from '@/utils/convert-timestamp-time';
import { FC } from 'react';

interface IChatList {
  sender: 'admin' | 'user';
  timestamp: number;
  message: string;
}

const ChatList: FC<IChatList> = ({
  timestamp, 
  sender,
  message
}) => {
  return (
    <div 
      key={timestamp}
      className={
        `flex ${sender === 'admin' ? 'justify-end' : 'justify-start'} w-full`}
    >
      <div 
        className={`flex ${sender === 'admin' ? 'flex-row' : 'flex-row-reverse'} items-end gap-1 max-w-[200px]`}
      >
        <p 
          className="text-[10px]"
        >
          {convertTimestampToTime(timestamp)}
        </p>
        <div className=""></div>
        <p 
          className="border px-2 rounded-md"
        >
          {message}
        </p>
      </div>
    </div>
  )
}

export default ChatList;