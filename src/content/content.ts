import * as browser from "webextension-polyfill";
import ContentPage from "./pages/ContentPage";
import {PayloadBase, SelectorPayload, SummarizationRequestPayload, TabMessage} from "../types";
import {mountReactElement} from "../util";
import {messageActions} from "../data/message-actions.ts";
import {BODY_COMPONENT_CLASSNAME, SIDEBAR_COMPONENT_ID} from "./constants.ts";

console.log("Content script successfully loaded");


browser.runtime.onMessage.addListener((message: unknown, _, sendResponse) => {
  const msg = message as TabMessage<PayloadBase>;

  if (msg.action === "getElement" && (msg.payload as SelectorPayload).selector) {
    const elementHtml = getElement((msg.payload as SelectorPayload).selector!);
    sendResponse({html: elementHtml});
    return true;
  }

  if (msg.action === messageActions.requestSummarization) {
    // NOTE: find body
    const payload = msg.payload as SummarizationRequestPayload;
    console.log(payload);

    // sidebar already mounted
    let sidebar = document.getElementById(SIDEBAR_COMPONENT_ID)

    if (!sidebar) {
      const body = document.querySelector("body");
      const head = document.querySelector("head");
      if (body === null || head === null) return true;

      // NOTE: pack body content to section
      const section = document.createElement("section");
      section.className = body.className;
      section.classList.add(BODY_COMPONENT_CLASSNAME);
      section.classList.add("relative");
      section.classList.add("col-span-2");
      section.innerHTML = body.innerHTML;

      body.innerHTML = section.outerHTML;
      body.className = "flex";// "grid grid-cols-3";

      // NOTE: render sidebar page
      sidebar = document.createElement("section");
      sidebar.id = SIDEBAR_COMPONENT_ID;

      body.appendChild(sidebar);
    }

    mountReactElement(sidebar, () => ContentPage({ payload }));

    return true;
  }

  return undefined;
});

function getElement(selector: string): string {
  const element = document.querySelector(selector);
  if (!element) return "";
  return element.outerHTML;
}
