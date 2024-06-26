import { createBrowserRouter, RouteObject } from "react-router-dom";
import App from "./App";
import { UploadsPage } from "./pages";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/uploads",
    element: <UploadsPage />,
  },
];

const router = createBrowserRouter(routes);

export { router };
