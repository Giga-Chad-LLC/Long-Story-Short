import {DarkModeIcon} from "../DarkModeIcon/DarkModeIcon.tsx";
import cn from "classnames";
import {SettingsIcon} from "../SettingsIcon/SettingsIcon.tsx";

interface HeaderProps {
   className?: string;
   openSettings: () => void;
}

const Header = ({ className, openSettings }: HeaderProps) => {
   return (
      <div className={cn(
         "flex justify-between align-center",
         className,
      )}>
         <SettingsIcon onClick={() => openSettings()} />
         <DarkModeIcon />
      </div>
   );
};

export default Header;
