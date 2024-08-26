import {useCallback, useEffect} from "react";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {okaidia} from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import {SidebarView} from "./SidebarView.tsx";
import {routes, SERVER_API_URL} from "../../../shared/protocol/apis.ts";
import {SummarizationRequestPayload} from "../../../shared/types";
import {Button} from "@nextui-org/button";
import {PluggableList} from "react-markdown/lib/react-markdown";
import {domElementToText} from "../../../shared/util";
import {BODY_COMPONENT_CLASSNAME} from "../../constants.ts";
import { readingTime } from 'reading-time-estimator';
import {useAction, useAtom} from "@reatom/npm-react";
import {readingStatsAtom} from "../../store/readingStats.ts";
import {generateSummaryAction, generateSummaryAtom} from "../../store/generateSummary.ts";


interface SidebarProps {
  payload: SummarizationRequestPayload
}


export const Sidebar = ({payload}: SidebarProps) => {
  const [,setStats] = useAtom(readingStatsAtom);
  const [parts, setAnswerParts] = useAtom(generateSummaryAtom);
  const generateSummary  = useAction(generateSummaryAction);

  useEffect(() => {
    const body = document.querySelector('body > section.' + BODY_COMPONENT_CLASSNAME);
    const text = domElementToText(body);

    const queryParams: Record<string, string> = {
      api: payload.request.api,
      model: payload.request.model,
      token: payload.request.token,
      objective: payload.objective,
      text: text.slice(0, 5000),
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
    const url = `${SERVER_API_URL}/${routes.summarize}?${query}`;
    generateSummary(url);
  }, [generateSummary, setAnswerParts, payload]);

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  const message = parts.join("");

  useEffect(() => {
    setStats(readingTime(message, 140 /* average reading speed per minute */, "en"))
  }, [setStats, message]);

  return (
    <SidebarView>
      <ReactMarkdown
        className={"prose prose-pre:p-0 prose-pre:bg-zinc-700"}
        rehypePlugins={[rehypeRaw] as PluggableList}
        remarkPlugins={[remarkGfm]}
        components={{
          code({children, className, ...rest}) {
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <div className="code-block">
                <div className="code-block-header text-white flex justify-between p-2 bg-[#272822] border-b-1 border-b-zinc-600 rounded-t-[0.3em]">
                  <span className="code-block-language">{match[1]}</span>
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
                <div className="[&>div]:!m-0 [&>div]:!rounded-t-none">
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
