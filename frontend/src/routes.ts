import { createBrowserRouter } from "react-router";
import { Root } from "./pages/Root";
import { Home } from "./pages/Home";
import { Theory } from "./pages/Theory";
import { Implementation } from "./pages/Implementation";
import { Experiments } from "./pages/Experiments";
import { Demo } from "./pages/Demo";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "theory", Component: Theory },
      { path: "implementation", Component: Implementation },
      { path: "experiments", Component: Experiments },
      { path: "demo", Component: Demo },
      { path: "*", Component: NotFound },
    ],
  },
]);
