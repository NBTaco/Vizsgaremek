import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './App.css'
import MainPage from './components/mainPage/mainpage';
import Aboutus from './components/aboutus/aboutus';
import Contact from './components/contact/contact';
import Products from './components/products/products';
import AdminMain from './components/adminMainPage/adminmain';

const router = createBrowserRouter([
  { path: '/', element: <MainPage /> },
  { path: '/aboutus', element: <Aboutus />},
  { path: '/contact', element: <Contact /> },
  { path: '/products', element: <Products /> },
  { path: '/adminmain', element: <AdminMain /> },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
