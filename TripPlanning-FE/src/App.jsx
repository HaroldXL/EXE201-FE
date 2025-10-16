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
import { useSelector } from "react-redux";
import Chatbot from "./pages/Chatbot/Chatbot";
import Explore from "./pages/Explore/LocationList/Explore";
import LocationDetail from "./pages/Explore/LocationDetail/LocationDetail";
import Search from "./pages/Search/Search";
import TripPlanning from "./pages/TripPlanning/TripCreate/TripPlanning";
import TripDetail from "./pages/TripPlanning/TripDetail/TripDetail";
import History from "./pages/Profile/History/History";
import SuggestReplace from "./pages/TripPlanning/SuggestReplace/SuggestReplace";
import Wallet from "./pages/Profile/Wallet/Wallet";
import AboutUs from "./pages/AboutUs/AboutUs";
import Help from "./pages/Profile/Help/Help";

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
          path: "explore/:id",
          element: <LocationDetail />,
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
          path: "profile/history",
          element: (
            <ProtectUserProfile>
              <History />
            </ProtectUserProfile>
          ),
        },
        {
          path: "profile/wallet",
          element: (
            <ProtectUserProfile>
              <Wallet />
            </ProtectUserProfile>
          ),
        },
        {
          path: "profile/help",
          element: (
            <ProtectUserProfile>
              <Help />
            </ProtectUserProfile>
          ),
        },
        {
          path: "chatbot",
          element: <Chatbot />,
        },
        {
          path: "about-us",
          element: <AboutUs />,
        },
        {
          path: "search",
          element: <Search />,
        },
        {
          path: "trip-planning",
          element: <TripPlanning />,
        },
        {
          path: "trip-planning/:id",
          element: <TripDetail />,
        },
        {
          path: "trip-planning/:itineraryId/suggest-replace/:orderIndex",
          element: <SuggestReplace />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
