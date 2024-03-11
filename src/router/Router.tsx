import ErrorPage from "../components/ErrorPage";
import CalendarPage from "../pages/CalendarPage";
import MainPage from "../pages/MainPage";
import { createBrowserRouter } from "react-router-dom";

export const Router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/calendar/:calendarUuid",
    element: <CalendarPage />,
    errorElement: <ErrorPage />,
  },
]);
