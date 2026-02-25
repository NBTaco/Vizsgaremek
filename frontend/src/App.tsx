import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './App.css'
import MainPage from './components/mainPage/mainpage';
import Aboutus from './components/aboutus/aboutus';
import Products from './components/products/products';
import OneProduct from './components/oneproduct/oneproduct';
import Cart from './components/cart/cart';
import FinalizeOrder from './components/finalizeorder/finalizeorder';
import Profile from './components/profile/profile';

const router = createBrowserRouter([
  { path: '/', element: <MainPage /> },
  { path: '/aboutus', element: <Aboutus />},
  { path: '/products', element: <Products /> },
  { path: "/product/:id", element: <OneProduct /> },
  { path: '/cart', element: <Cart /> },
  { path: '/finalize', element: <FinalizeOrder /> },
  { path: '/profile', element: <Profile /> },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
