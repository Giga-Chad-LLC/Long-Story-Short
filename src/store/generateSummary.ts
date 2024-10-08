import { reatomAsync, withAbort } from '@reatom/async'
import {atom} from "@reatom/core";
import {parseStreamResponse} from "../shared/util/parseStreamResponse.ts";
import {routes, SERVER_API_URL} from "../shared/protocol/apis.ts";

export const generateSummaryAtom = atom<string[]>([], "generateSummaryAtom");

export const generateSummaryAction = reatomAsync(async (ctx, query: string) => {
  fetch(`${SERVER_API_URL}/${routes.summarize}?${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    signal: ctx.controller.signal
  }).then(async (res) => {
    generateSummaryAtom(ctx, []);

    await parseStreamResponse(res, (done, data) => {
      if (done) {
        return true;
      }

      switch (data.reason) {
        case "CHUNK": {
          generateSummaryAtom(ctx,(prev) => [...prev, data.content]);
          break;
        }
        case "END": {
          break;
        }
      }
      return false;
    });
  });
}, "generateSummary")
  .pipe(withAbort());

export const isGenerateSummaryLoading = atom(
  (ctx) => ctx.spy(generateSummaryAction.pendingAtom) > 0,
  "isGenerateSummaryLoading",
);
