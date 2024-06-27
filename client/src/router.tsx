import { createBrowserRouter, RouteObject } from "react-router-dom";
import App from "./App";
import { ResumePage, UploadsPage } from "./pages";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/uploads",
    element: <UploadsPage />,
  },
  {
    path: "/resumes/:uploadId",
    element: <ResumePage />,
  },
];

const router = createBrowserRouter(routes);

export { router };
