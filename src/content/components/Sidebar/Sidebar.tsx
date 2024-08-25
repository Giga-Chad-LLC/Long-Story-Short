import {useCallback, useEffect, useState} from "react";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {okaidia} from "react-syntax-highlighter/dist/esm/styles/prism";
import {parseStreamResponse} from "../../../util/parseStreamResponse.ts";
import ReactMarkdown from "react-markdown";
import {SidebarView} from "./SidebarView.tsx";
import {routes, SERVER_API_URL} from "../../../shared/protocol/apis.ts";
import {SummarizationRequestPayload} from "../../../types";
import {Button} from "@nextui-org/button";
import {PluggableList} from "react-markdown/lib/react-markdown";


interface SidebarProps {
  payload: SummarizationRequestPayload
}


export const Sidebar = ({payload}: SidebarProps) => {
  const [, setFinished] = useState(false);
  const [parts, setAnswerParts] = useState<string[]>([]);

  useEffect(() => {
    const queryParams: Record<string, string> = {
      api: payload.request.api,
      model: payload.request.model,
      iv: payload.iv,
      encrypted_token: payload.encryptedToken,
      objective: payload.objective,
      text: "This text is about mammoths! They all have died. Unfortunately.",
    }

    const params = new URLSearchParams(queryParams);
    // insert instructions

    if (payload.instructions.length > 0) {
      payload.instructions.forEach(instruction => params.append("instructions", instruction));
    }
    else {
      params.append("instructions", "");
    }

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
    }).catch(err => {
        console.log(err);
        alert(`Error occurred: ${err.message}`)
      });
    // TODO: should payload be mentioned here?
  }, [setFinished, setAnswerParts]);

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  const message = parts.join("");

  return (
    <SidebarView>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw] as PluggableList}
        remarkPlugins={[remarkGfm]}
        components={{
          code({children, className, ...rest}) {
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <div className="code-block">
                <div className="code-block-header text-white flex justify-between p-2">
                  <span className="code-block-language text-zinc-900">{match[1]}</span>
                  <Button
                    size="sm"
                    color="primary"
                    onClick={() =>
                      handleCopy(String(children).replace(/\n$/, ""))
                    }
                  >
                    Copy
                  </Button>
                </div>
                <div className="[&>div]:!m-0">
                  <SyntaxHighlighter
                    style={okaidia}
                    language={match[1]}
                    PreTag="div"
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                </div>
              </div>
            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            );
          },
        }}
      >
        {message}
      </ReactMarkdown>
    </SidebarView>
  );
}
