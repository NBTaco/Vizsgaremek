import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './App.css'
import MainPage from './components/mainPage/mainpage';
import Aboutus from './components/aboutus/aboutus';

const router = createBrowserRouter([
  { path: '/', element: <MainPage /> },
  { path: '/aboutus', element: <Aboutus />},
  { path: '/ujadat', element: ""} ,
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
