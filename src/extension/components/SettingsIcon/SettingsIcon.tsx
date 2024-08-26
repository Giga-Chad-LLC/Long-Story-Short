import {GearIcon} from "../../../shared/icons";
import {useAtom} from "@reatom/npm-react";
import {darkModeAtom} from "../../store/darkModeAtom.ts";

interface SettingsIconProps {
  onClick: () => void;
}

export const SettingsIcon = ({onClick}: SettingsIconProps) => {
  const [darkMode] = useAtom(darkModeAtom);

  return (
    <div className="cursor-pointer" onClick={onClick}>
      <GearIcon width={20} height={20} fill={darkMode ? "#fff" : "#000"}/>
    </div>
  );
};
