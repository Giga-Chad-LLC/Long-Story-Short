
function App() {
   // @ts-ignore
   const onClick = async () => {
      const [tab] = await chrome.tabs.query({ active: true })

      if (!tab.id) {
         alert("No tab id available")
         return;
      }

      await chrome.scripting.executeScript({
         target: { tabId: tab.id },
         func: () => {
            alert("My Extension!")
         },
      });
   }

  return (
     <>
        <h1 className="text-center text-3xl font-bold underline">
           Hello world!!!
        </h1>
        <button onClick={() => onClick()}>Click!</button>
     </>
  )
}

export default App
