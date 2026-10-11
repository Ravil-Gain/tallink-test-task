import { redirect } from "react-router";
import Layout from "../shared/ui/Layout";
import ExchangePage from "../pages/ExchangePage";
import HistoryPage from "../pages/HistoryPage";
import NotFoundPage from "../pages/NotFoundPage";

export const routes = [
  { path: "/", loader: () => redirect("/exchange") },
  {
    Component: Layout,
    children: [
      { path: "/exchange", Component: ExchangePage },
      { path: "/history", Component: HistoryPage },
    ],
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
];
