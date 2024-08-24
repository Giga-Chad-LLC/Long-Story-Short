import {useDarkMode} from "../../../providers/DarkModeProvider.tsx";

const DarkModeIcon = () => {
   const { darkMode, toggleDarkMode } = useDarkMode()


   return (
   <div className="h-[20px] w-[20px]" onClick={() => toggleDarkMode()}>
      {
         !darkMode ? (
            // moon icon
            <img alt="Sun icon" src="/icons/moon-black.svg"/>
         ): (
            // sun icon
            <img alt="Sun icon" src="/icons/sun-white.svg" />
         )
      }
   </div>
   );
};

export default DarkModeIcon;