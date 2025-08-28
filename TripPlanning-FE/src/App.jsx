import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./assets/pages/Home/Home";
import Layout from "./assets/components/Layout";
import Login from "./assets/pages/Authentication/Login/Login";
import Register from "./assets/pages/Authentication/Register/Register";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        {
          path: "login",
          element: (
            // <ProtectRouteAuth>
            <Login />
            //</ProtectRouteAuth>
          ),
        },
        {
          path: "register",
          element: (
            //<ProtectRouteAuth>
            <Register />
            //</ProtectRouteAuth>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
