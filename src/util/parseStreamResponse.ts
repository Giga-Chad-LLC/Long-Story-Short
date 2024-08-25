import {AxiosResponse} from "axios";

/**
 *
 * @param response
 * @param callback returns `true` if the execution should stop, otherwise `false`
 */
export const parseStreamResponse = async (response: AxiosResponse, callback: (done: boolean, data: any) => boolean) => {
  const decoder = new TextDecoder();

  const reader = response.data.getReader();
  if (!reader) {
    throw new Error("Reader is undefined");
  }

  let requestedStop = false;

  while (!requestedStop) {
    const {value, done} = await reader.read();

    if (done) {
      callback(done, null);
      break;
    }

    // TODO: notify callback?
    if (!value) {
      continue;
    }

    const responses = decoder.decode(value).split("\n");

    responses.forEach((response) => {
      try {
        const chunkText = response.replace("data:", "").trim();
        if (chunkText) {
          const data = JSON.parse(chunkText);
          requestedStop = callback(done, data);
        }
      } catch(err) {
        console.error(err);
        throw err;
      }
    });
  }
};
