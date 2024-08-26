import {createRoot} from "react-dom/client";
import {JSX} from "react";

export const mountReactElement = (destination: HTMLElement, reactNode: () => JSX.Element): void => {
  return createRoot(destination).render(reactNode());
}
