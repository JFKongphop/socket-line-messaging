import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import Header from '@/components/layout/Header';

const App = () => {
  return (
    <Header>
      <RouterProvider router={router} />
    </Header>
  )
}

export default App;