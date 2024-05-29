import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/Layout";
import { HomeScreen } from "../pages/HomeScreen";
import { Draw } from "../components/Draw";

export const MainRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomeScreen />,
      },
    ],
  },
]);
