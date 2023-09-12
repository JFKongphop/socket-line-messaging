import { UserList } from '@/type/chat-type';
import { FC } from 'react';
import ChatClientList from '../ListData/ChatClientList';

interface IClientSideBar {
  userLists: UserList[];
  onUserChatHandler: (userId: string) => void;
}

const ClientSideBar: FC<IClientSideBar> = ({ 
  userLists,
  onUserChatHandler 
}) => {
  return (
    <aside
      className="col-span-1 border-r-2 flex flex-col gap-4"
    >
      <ul
        role="list" 
        className="relative z-0 divide-y-2 flex flex-col divide-gray-200"
      >
        {
          userLists.map((user) => (
            <ChatClientList 
              key={user.userId}
              userId={user.userId}
              pictureUrl={user.pictureUrl}
              displayName={user.displayName}
              chats={user.chats}
              latestActive={user.latestActive}
              latestOpenChat={user.latestOpenChat}
              onUserChatHandler={onUserChatHandler}
            />
          ))
        }
      </ul>
    </aside>
  )
}

export default ClientSideBar;