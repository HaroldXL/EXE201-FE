import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Authentication/Login/Login";
import Register from "./pages/Authentication/Register/Register";
import Layout from "./components/layout/Layout";
import ProfilePav from "./pages/Profile/ProfilePav/ProfilePav";
import Info from "./pages/Profile/Info/Info";
import Test from "./pages/test/test";

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
        {
          path: "profile",
          element: (
            //<ProtectRouteAuth>
            <ProfilePav />
            //</ProtectRouteAuth>
          ),
        },
        {
          path: "profile/info",
          element: (
            //<ProtectRouteAuth>
            <Info />
            //</ProtectRouteAuth>
          ),
        },
        {
          path: "test",
          element: (
            //<ProtectRouteAuth>
            <Test />
            //</ProtectRouteAuth>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
