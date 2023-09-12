import { PersonalChat } from '@/type/chat-type';
import { convertShortMessage } from '@/utils/short-message';
import { FC } from 'react';

interface IChatClientList {
  userId: string;
  pictureUrl: string;
  displayName: string;
  chats: PersonalChat;
  latestActive: number;
  latestOpenChat: number;
  onUserChatHandler: (userId: string) => void;
}

const ChatClientList: FC<IChatClientList> = ({
  userId,
  pictureUrl,
  displayName,
  chats,
  latestActive,
  latestOpenChat,
  onUserChatHandler,
}) => {

  return (
    <li 
      className="flex flex-row gap-4 justify-between items-center h-16 p-2 cursor-pointer hover:bg-slate-200"
      onClick={() => onUserChatHandler(userId)}
    >
      <img 
        src={`${pictureUrl}`}
        className="h-12 w-12 rounded-full" 
      />
      <div className="flex flex-col">
        <p 
          className="text-slate-800 font-medium text-end"
        >
          {displayName}
        </p>
        <div 
          className="flex flex-row text-xs justify-end items-center gap-1"
        >
          <p 
            className={`text-slate-800/40 ${(chats.sender === 'user' && latestActive > latestOpenChat) && 'font-bold text-slate-800/70'} text-end`}
          >
            {convertShortMessage(chats.message)}
          </p>
          {
            (
              chats.sender === 'user' && latestActive > latestOpenChat
            ) 
            && 
            (
              <div 
                className="bg-slate-800 text-[10px] font-bold text-white px-1 rounded-md flex justify-center items-center"
              >
                <p >
                  new
                </p>
              </div>
            )
          }
        </div>
      </div>
    </li>
  )
}

export default ChatClientList;