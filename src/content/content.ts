import * as browser from "webextension-polyfill";
import ContentPage from "./pages/ContentPage";
import {Message} from "../types";
import {mountReactElement} from "../util/mountReactElement.tsx";

console.log("Контентный скрипт загружен.");

browser.runtime.onMessage.addListener((message: unknown, _, sendResponse) => {
  const msg = message as Message;

  if (msg.action === "getElement" && msg.selector) {
    const elementHtml = getElement(msg.selector);
    sendResponse({html: elementHtml});
    return true;
  }

  if (msg.action === "addSidebar" && msg.data !== undefined) {
    // NOTE: find body
    const body = document.querySelector("body");
    const head = document.querySelector("head");
    if (body === null || head === null) return true;

    // NOTE: pack body content to section
    const section = document.createElement("section");
    section.className = body.className;
    section.classList.add("relative");
    section.classList.add("col-span-2");

    section.innerHTML = body.innerHTML;
    body.innerHTML = section.outerHTML;
    body.className = "grid grid-cols-3";

    // NOTE: render sidebar page
    const sidebar = document.createElement("section");
    mountReactElement(sidebar, ContentPage);
    body.appendChild(sidebar);
    return true;
  }
  return undefined;
});

function getElement(selector: string): string {
  const element = document.querySelector(selector);
  if (!element) return "";
  return element.outerHTML;
}
