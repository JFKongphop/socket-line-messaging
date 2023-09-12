import { BiSolidRightArrow } from 'react-icons/bi';
import type { MessageSender } from '@/type/chat-type';
import type { 
  FC, 
  MouseEventHandler 
} from 'react';
import type { UseFormRegister } from 'react-hook-form';

interface ISendMessageInput {
  name: 'message';
  register: UseFormRegister<MessageSender>;
  onSubmitMessageHandler: (data: MessageSender) => void
  handleSubmit: (data: any) => MouseEventHandler
}

const SendMessageInput: FC<ISendMessageInput> = ({
  name,
  register,
  onSubmitMessageHandler,
  handleSubmit,
}) => {
  return (
    <>
      <div className="border-2 h-full rounded-md w-[95%] p-2">
        <textarea 
          className="w-full border-none border-transparent outline-none focus:outline-none h-full text-xl resize-none"
          {...register(name)}
        />
      </div>
      <BiSolidRightArrow 
        className="text-5xl fill-slate-800 cursor-pointer hover:fill-slate-600"
        onClick={handleSubmit(onSubmitMessageHandler)}
      />
    </>
  )
}

export default SendMessageInput;