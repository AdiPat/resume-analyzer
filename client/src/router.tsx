import { createBrowserRouter, RouteObject } from "react-router-dom";
import App from "./App";
import { ResumeAnalysisPage, UploadsPage } from "./pages";

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
    element: <ResumeAnalysisPage />,
  },
];

const router = createBrowserRouter(routes);

export { router };
