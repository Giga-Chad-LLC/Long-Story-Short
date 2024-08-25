import {useEffect, useState} from "react";
import {parseStreamResponse} from "../../../util/parseStreamResponse.ts";
import ReactMarkdown from "react-markdown";
import {SidebarView} from "./SidebarView.tsx";
import {routes, SERVER_API_URL} from "../../../shared/protocol/apis.ts";
import {SummarizationRequestPayload} from "../../../types";


interface SidebarProps {
  payload: SummarizationRequestPayload
}


export const Sidebar = ({ payload }: SidebarProps) => {
  const [_finished, setFinished] = useState(false);
  const [parts, setAnswerParts] = useState<string[]>([]);

  useEffect(() => {
    const queryParams: Record<string, string> = {
      api: payload.request.api,
      model: payload.request.model,
      token: payload.request.token,
      objective: payload.objective,
      text: "This text is about mammoths! They all have died. Unfortunately.",
    }

    const params = new URLSearchParams(queryParams);
    // insert instructions
    payload.instructions.forEach(instruction => params.append("instructions", instruction));

    const query = params.toString();

    console.log("instructions:", payload.instructions.join(","))
    console.log("query:", query)

    fetch(`${SERVER_API_URL}/${routes.summarize}?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(async (res) => {
      await parseStreamResponse(res, (done, data) => {
        if (done) {
          setFinished(true);
          return true;
        }

        switch (data.reason) {
          case "CHUNK": {
            setAnswerParts((prev) => [...prev, data.content]);
            break;
          }
          case "END": {
            setFinished(true);
            break;
          }
        }
        return false;
      });
    });
  }, []);

  const message = parts.join("");

  return (
    <SidebarView>
      <ReactMarkdown>{message}</ReactMarkdown>
    </SidebarView>
  );
}
