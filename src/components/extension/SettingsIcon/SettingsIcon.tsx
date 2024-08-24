import {useDarkMode} from "../../../providers/DarkModeProvider.tsx";

interface SettingsIconProps {
   onClick: () => void;
}

const SettingsIcon = ({ onClick }: SettingsIconProps) => {
   const { darkMode } = useDarkMode();

   return (
      <div className="h-[20px] w-[20px]" onClick={() => onClick()}>
         {
            !darkMode ? (
               // moon icon
               <img alt="Sun icon" src="/icons/gear-black.svg"/>
            ): (
               // sun icon
               <img alt="Sun icon" src="/icons/gear-white.svg" />
            )
         }
      </div>
   );
};

export default SettingsIcon;