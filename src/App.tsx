import cn from "classnames";
import Main from "./extension/pages/Main.tsx";
import {useAtom} from "@reatom/npm-react";
import {darkModeAtom} from "./store/darkModeAtom.ts";

function App() {
  const [darkMode] = useAtom(darkModeAtom);
  return (
    <div className={cn(
      darkMode ? "dark" : "",
      "text-foreground bg-background h-screen",
    )}>
      <Main domain={"google.com"}/>
    </div>
  )
}

export default App
