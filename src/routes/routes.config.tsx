
import LandingPage from "@/pages/LandingPage";
import NotFound from "@/pages/NotFound";
import UpcomingSession from "@/pages/session/UpcomingSession";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";

export const routesConfig = [
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/sessions",
    element: <UpcomingSession />,
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  
  
  {
    path: "*",
    element: <NotFound />,
  },
];
