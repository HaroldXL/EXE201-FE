import "./App.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Authentication/Login/Login";
import Register from "./pages/Authentication/Register/Register";
import Layout from "./components/layout/Layout";
import ProfilePav from "./pages/Profile/ProfilePav/ProfilePav";
import Info from "./pages/Profile/Info/Info";
import Test from "./pages/test/test";
import Explore from "./pages/Explore/Explore";
import { useSelector } from "react-redux";
import Chatbot from "./pages/Chatbot/Chatbot";

const ProtectRouteAuth = ({ children }) => {
  const user = useSelector((store) => store.user);
  if (user == null) {
    return children;
  } else if (user && user.user.roleName === "admin") {
    return <Navigate to="/admin" />;
  } else {
    return <Navigate to="/" />;
  }
};

const ProtectUserProfile = ({ children }) => {
  const user = useSelector((store) => store.user);
  if (user != null) {
    return children;
  }
  return <Navigate to={"/"} />;
};

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
            <ProtectRouteAuth>
              <Login />
            </ProtectRouteAuth>
          ),
        },
        {
          path: "register",
          element: (
            <ProtectRouteAuth>
              <Register />
            </ProtectRouteAuth>
          ),
        },
        {
          path: "explore",
          element: <Explore />,
        },
        {
          path: "profile",
          element: (
            <ProtectUserProfile>
              <ProfilePav />
            </ProtectUserProfile>
          ),
        },
        {
          path: "profile/info",
          element: (
            <ProtectUserProfile>
              <Info />
            </ProtectUserProfile>
          ),
        },
        {
          path: "chatbot",
          element: (
            //<ProtectRouteAuth>
            <Chatbot />
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
