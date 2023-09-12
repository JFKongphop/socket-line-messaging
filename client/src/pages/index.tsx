import { VITE_API_ENDPOINT } from '@/configs/enviroment';
import type { 
  MessageSender, 
  PersonalChat, 
  PersonalChatIOResponse, 
  UserList 
} from '@/type/chat-type';
import { useEffect, useRef, useState } from 'react'
import { io } from "socket.io-client";
import { BiSolidRightArrow } from 'react-icons/bi'
import { AxiosResponse } from 'axios';
import LineRequest from '@/lib/line-request';
import { useForm } from 'react-hook-form';
import { convertTimestampToTime } from '@/utils/convert-timestamp-time';
import { separateDayChats } from '@/utils/day-key-chats';
import { ConvertShortMessage } from '@/utils/short-message';

const socket = io(VITE_API_ENDPOINT);

const defaultValues = {
  message: ''
}

const index = () => {
  const [userLists, setUserLists] = useState<UserList[]>([]);
  const [userId, setUserId] = useState<string>('');
  const [personalChats, setPersonalChats] = useState<PersonalChat[]>([]);
  const [chatBoxHeight, setChatBoxHeight] = useState<number>(0);
  const [chatInnerHeight, setChatInnerHeight] = useState<number>(0);
  const [latestChats, setLatestChats] = useState<PersonalChatIOResponse>();

  const {
    register,
    handleSubmit,
    reset,
    watch,
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

  const userChatHandler = async (userId: string) => {    
    socket.emit('join-room', userId);
    const { data }: AxiosResponse<{ chats: PersonalChat[] }> = await LineRequest.get(
      `/chat/${userId}`
    );

    setUserId(userId);
    setPersonalChats(data.chats);
  };

  const submitMessageHandler = async ({ message }: MessageSender) => {
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

  const timestampsByDay: any = separateDayChats(personalChats);

  return (
    <div className="grid grid-cols-4 h-full">
      <aside
        className="col-span-1 border-r-2 flex flex-col gap-4"
      >
        <ul
          role="list" 
          className="relative z-0 divide-y-2 flex flex-col divide-gray-200"
        >
          {
            userLists.map((user) => (
              <li 
                key={user.userId}
                className="flex flex-row gap-4 justify-between items-center h-16 p-2 cursor-pointer hover:bg-slate-200"
                onClick={() => userChatHandler(user.userId)}
              >
                <img 
                  src={`${user.pictureUrl}`}
                  className="h-12 w-12 rounded-full" 
                />
                <div className="flex flex-col">
                  <p 
                    className="text-slate-800 font-medium text-end"
                  >
                    {user.displayName}
                  </p>
                  <div 
                    className="flex flex-row text-xs justify-end items-center gap-1"
                  >
                    <p 
                      className={`text-slate-800/40 ${(user.chats.sender === 'user' && user.latestActive > user.latestOpenChat) && 'font-bold text-slate-800/70'} text-end`}
                    >
                      {ConvertShortMessage(user.chats.message)}
                    </p>
                    {
                      (
                        user.chats.sender === 'user' && user.latestActive > user.latestOpenChat
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
            ))
          }
        </ul>
      </aside>
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
                      <div 
                        key={dayKeys}
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
                              <div 
                                key={chat.timestamp}
                                className={
                                  `flex ${chat.sender === 'admin' ? 'justify-end' : 'justify-start'} w-full`}
                              >
                                <div 
                                  className={`flex ${chat.sender === 'admin' ? 'flex-row' : 'flex-row-reverse'} items-end gap-1 max-w-[200px]`}
                                >
                                  <p 
                                    className="text-[10px]"
                                  >
                                    {convertTimestampToTime(chat.timestamp)}
                                  </p>
                                  <div className=""></div>
                                  <p 
                                    className="border px-2 rounded-md"
                                  >
                                    {chat.message}
                                  </p>
                                </div>
                              </div>
                            ))
                          }

                        </div>
                        
                      </div>
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
                <div className="border-2 h-full rounded-md w-[95%] p-2">
                  <textarea 
                    className="w-full border-none border-transparent outline-none focus:outline-none h-full text-xl resize-none"
                    {...register('message')}
                    // onKeyDown={enterSubmitMessage}
                  />
                </div>
                <BiSolidRightArrow 
                  className="text-5xl fill-slate-800 cursor-pointer hover:fill-slate-600"
                  onClick={handleSubmit(submitMessageHandler)}
                />
              </div>
            </>
          )
        }
      </div>
    </div>
  )
}

export default index;
