import { RouterProvider } from "react-router";
import { MainRouter } from "./router/MainRouter";

export const App = () => {
  return (
    <div>
      <RouterProvider router={MainRouter} />
    </div>
  );
};
