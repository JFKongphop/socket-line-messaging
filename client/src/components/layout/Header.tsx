import type { 
  FC, 
  ReactNode 
} from 'react';

interface IHeader {
  children: ReactNode
}

const Header: FC<IHeader> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      <header 
        className="w-full h-20 bg-slate-800 flex flex-row p-4 items-center"
      >
        <h1 className="text-4xl text-white font-bold ">
          Line Chat
        </h1>
      </header>
      <div className='h-screen'>{children}</div>
    </div>
  )
}

export default Header;