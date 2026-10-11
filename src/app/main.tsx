import { RouterProvider } from "react-router/dom";
import { createBrowserRouter } from "react-router";
import { createRoot } from "react-dom/client";
import { routes } from "./routes";
import { StrictMode } from "react";
import "../index.css";

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
