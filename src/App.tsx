import {cn} from "./lib/utils.ts";
import Main from "./pages/extension/Main.tsx";
import {useDarkMode} from "./providers/DarkModeProvider.tsx";

function App() {
   const { darkMode } = useDarkMode();

   // @ts-ignore
   const onClick = async () => {
      const [tab] = await chrome.tabs.query({ active: true })

      if (!tab.id) {
         alert("No tab id available");
         return;
      }

      await chrome.scripting.executeScript({
         target: { tabId: tab.id },
         func: () => {
            /**
             * Access DOM elements of the active tab
             */
            document.body.style.backgroundColor = "purple"
         },
      });
   }

  return (
     <div className={cn(
        darkMode ? "dark" : "",
        "text-foreground bg-background h-screen",
     )}>
        <Main domain={"google.com"} />
     </div>
  )
}

export default App
