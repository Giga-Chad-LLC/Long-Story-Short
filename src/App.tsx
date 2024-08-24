
function App() {
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
            alert("My Extension HEEEERRREE!!!!")
         },
      });
   }

  return (
     <>
        <button className="text-center" onClick={() => onClick()}>Click!</button>
     </>
  )
}

export default App
