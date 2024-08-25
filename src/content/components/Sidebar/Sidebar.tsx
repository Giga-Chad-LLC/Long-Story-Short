import {useEffect, useState} from "react";
import {parseStreamResponse} from "../../../util/parseStreamResponse.ts";
import ReactMarkdown from "react-markdown";
import {SidebarView} from "./SidebarView.tsx";
import axios from 'axios';
import {routes, SERVER_API_URL} from "../../../shared/protocol/apis.ts";


export const Sidebar = () => {
  const [_finished, setFinished] = useState(false);
  const [parts, setAnswerParts] = useState<string[]>([]);

  useEffect(() => {
    axios.get(`${SERVER_API_URL}/${routes.summarize}`, {
      params: {
        query: "Hello",
      },
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
