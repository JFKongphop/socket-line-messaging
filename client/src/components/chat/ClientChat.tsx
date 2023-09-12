import { 
  useEffect, 
  useState, 
  useRef
} from 'react';
import { separateDayChats } from '@/utils/day-key-chats';

import SendMessageInput from '../input/SendMessageInput';
import ChatGroupDate from '../ListData/ChatGroupDate';

import type { 
  MessageSender, 
  PersonalChat 
} from '@/type/chat-type';
import type { 
  FC, 
  MouseEventHandler 
} from 'react';
import type { UseFormRegister } from 'react-hook-form';


interface IClientChat {
  userId: string;
  personalChats: PersonalChat[];
  register: UseFormRegister<MessageSender>;
  onSubmitMessageHandler: (data: MessageSender) => void
  handleSubmit: (data: any) => MouseEventHandler
}

const ClientChat: FC<IClientChat> = ({
  userId,
  personalChats,
  onSubmitMessageHandler,
  register,
  handleSubmit
}) => {

  const [chatBoxHeight, setChatBoxHeight] = useState<number>(0);
  const [chatInnerHeight, setChatInnerHeight] = useState<number>(0);

  const chatBoxRef = useRef<any>();
  const chatInnerRef = useRef<any>();

  useEffect(() => {
    if (chatBoxRef.current) {
      const divHeight = chatBoxRef.current.clientHeight;
      setChatBoxHeight(divHeight)
    }
  }, []);

  useEffect(() => {
    if (chatInnerRef.current) {
      const divHeight = chatInnerRef.current.clientHeight;
      setChatInnerHeight(divHeight);
    }
  }, [userId]);

  const timestampsByDay: any = separateDayChats(personalChats);

  return (
    <div 
      className="col-span-3 flex flex-col divide-y-2" 
      ref={chatBoxRef}
    >
      {
        userId && 
        (
          <>
            <div 
              style={{
                height: chatBoxHeight * 0.85
              }}
              className="px-2 py-1"
            >
              <div 
                className={`w-full ${chatInnerHeight + 200 > chatBoxHeight && 'h-full'} flex flex-col-reverse gap-4 overflow-y-auto items-start justify-start`}
                ref={chatInnerRef}
              >
                {
                  Object.keys(timestampsByDay).map((dayKeys) => (
                    <ChatGroupDate 
                      key={dayKeys}
                      timestampsByDay={timestampsByDay}
                      dayKeys={dayKeys}
                    />
                  ))
                }
              </div>

            </div>
            <div
              style={{
                height: chatBoxHeight * 0.15
              }}
              className="p-2 flex flex-row gap-1 w-full items-center"
            >
              <SendMessageInput 
                name='message'
                register={register}
                onSubmitMessageHandler={onSubmitMessageHandler}
                handleSubmit={handleSubmit}
              />
            </div>
          </>
        )
      }
    </div>
  )
}

export default ClientChat