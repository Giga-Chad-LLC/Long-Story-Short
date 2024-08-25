import * as browser from "webextension-polyfill";
import {PayloadBase, TabMessage} from "../../types";

export class MessageApi {
  static async send<Payload extends PayloadBase>(action: string, payload: Payload) {
    const [tab] = await browser.tabs.query({active: true, currentWindow: true});

    if (!tab.id) {
      throw Error(`No active tab in the current window not found`);
    }

    await browser.tabs.sendMessage<TabMessage<Payload>>(tab.id, {
      action,
      payload,
    });
  }
}
