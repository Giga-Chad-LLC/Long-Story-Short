import {createRoot} from "react-dom/client";
import {JSX} from "react";

export const mountReactElement = (element: HTMLElement, reactNode: () => JSX.Element): void => {
  return createRoot(element).render(reactNode());
}
