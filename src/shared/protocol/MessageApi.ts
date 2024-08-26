import * as browser from "webextension-polyfill";
import {PayloadBase, TabMessage} from "../types";

export class MessageApi {
  static async send<Payload extends PayloadBase, TResponse = unknown>(action: string, payload: Payload): Promise<TResponse> {
    const [tab] = await browser.tabs.query({active: true, currentWindow: true});

    if (!tab.id) {
      throw Error(`No active tab in the current window not found`);
    }

    return await browser.tabs.sendMessage<TabMessage<Payload>, TResponse>(tab.id, {
      action,
      payload,
    });
  }
}
