import './App.css'
import Layout from './components/Layout/Layout';
import Home from './routes/home/Home';
import Login from './routes/login/Login';
import Register from './routes/register/Register';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Product from './routes/product/Product';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element:<Layout/>,
      children : [
        {
          path: "/",
          element: <Home />
        },
        {
          path: "/product/:productId",
          element: <Product />,
        },
      ],
    },
    {
      path: "/",
      children: [
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/login",
          element: <Login />,
        },
      ],
    },
    
  ]);

  return (
    
   <RouterProvider router={router} />
  )
}

export default App