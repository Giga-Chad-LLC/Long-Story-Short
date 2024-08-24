import {useAtom} from "@reatom/npm-react";
import {darkModeAtom} from "../../../store/darkModeAtom.ts";
import {MoonIcon, SunIcon} from "../../../shared/icons";

export const DarkModeIcon = () => {
    const [darkMode, setDarkMode] = useAtom(darkModeAtom);
    return (
        <div className={"cursor-pointer"} onClick={() => setDarkMode((state) => !state)}>
            {
                darkMode ? (
                    <SunIcon width={20} height={20} fill={"#fff"}/>
                ) : (
                    <MoonIcon width={20} height={20}/>
                )
            }
        </div>
    );
};
