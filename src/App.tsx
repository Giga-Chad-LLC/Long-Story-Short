import cn from "classnames";
import Main from "./extension/pages/Main.tsx";
import {useAtom} from "@reatom/npm-react";
import {darkModeAtom} from "./extension/store/darkModeAtom.ts";
import {useEffect, useState} from "react";
import {MessageApi} from "./shared/protocol/MessageApi.ts";
import {EmptyPayload} from "./shared/types";
import {messageActions} from "./extension/data/message-actions.ts";

function App() {
  const [darkMode] = useAtom(darkModeAtom);
  const [domain, setDomain] = useState("");

  useEffect(() => {
    MessageApi.send<EmptyPayload, string>(messageActions.getHostname, {})
      .then(setDomain);
  }, [setDomain]);

  return (
    <div className={cn(
      darkMode ? "dark" : "",
      "text-foreground bg-background h-screen",
    )}>
      <Main domain={domain}/>
    </div>
  )
}

export default App
