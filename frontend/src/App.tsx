import './App.css'
import MainPage from './components/mainPage/mainpage';
import Aboutus from './components/aboutus/aboutus';
import Products from './components/products/products';
import OneProduct from './components/oneproduct/oneproduct';
import Cart from './components/cart/cart';
import FinalizeOrder from './components/finalizeorder/finalizeorder';
import Profile from './components/profile/profile';
import AdminOrders from './components/adminorders/adminorders';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  role: string;
  exp: number;
}

function adminOnly(element : any) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" replace />;
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    if (decoded.role !== "admin") return <Navigate to="/" replace />;
    return element;
  } catch {
    return <Navigate to="/" replace />;
  }
}

const router = createBrowserRouter([
  { path: '/', element: <MainPage /> },
  { path: '/aboutus', element: <Aboutus />},
  { path: '/products', element: <Products /> },
  { path: "/product/:id", element: <OneProduct /> },
  { path: '/cart', element: <Cart /> },
  { path: '/finalize', element: <FinalizeOrder /> },
  { path: '/profile', element: <Profile /> },
  { path: '/adminorder', element: adminOnly(<AdminOrders />) },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App