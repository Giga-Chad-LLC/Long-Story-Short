import React, {useState} from 'react';
import {useSidebar} from './useSidebar';
import cn from "classnames";
import {CaretLeft, CaretRight} from "../../../shared/icons";
import {useAtom} from "@reatom/npm-react";
import {readingStatsAtom} from "../../store/readingStats.ts";

interface SidebarProps {
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  children: React.ReactNode;
}

export const SidebarView: React.FC<SidebarProps> = ({
                                                      initialWidth = 300,
                                                      minWidth = 200,
                                                      maxWidth = 600,
                                                      children,
                                                    }) => {
  const {isOpen, width, closeSidebar, openSidebar, handleResize} = useSidebar({
    initialWidth,
    minWidth,
    maxWidth,
  });
  const [stats] = useAtom(readingStatsAtom);

  const [isDrag, setDrag] = useState(false);

  // Handle the drag functionality for resizing the sidebar
  const onDrag = (e: MouseEvent) => {
    handleResize(window.innerWidth - e.clientX);
  };

  const sidebarStyles = "bg-white shadow-md shadow-lightgray"
  const commonStyles = "h-full min-h-screen";


  return (
    <>
      <div
        className={cn(
          "fixed top-0 right-0 z-[10000] overflow-auto drop-shadow-2xl",
          !isDrag && "duration-500",
          sidebarStyles,
          commonStyles,
        )}
        style={{
          width: isOpen ? width : 50
        }}
      >
        <div
          className={cn(
            "sticky z-[100000] top-0 left-0 w-full h-12",
            "bg-white",
            "flex items-center p-2",
            isOpen ? "justify-between drop-shadow-md" : "justify-end"
          )}>
          {isOpen && <div className="mb-2">
            {stats && <span className="italic text-sm text-zinc-600">{stats.text}, {stats.words} words</span>}
          </div>
          }
          <div
            className="flex justify-end p-1 cursor-pointer hover:bg-zinc-300 rounded-full">
            {
              isOpen ? (<CaretRight width={24} height={24} onClick={closeSidebar}/>) :
                (<CaretLeft width={24} height={24} onClick={openSidebar}/>)
            }
          </div>
          {/* Resize Handle */}
          <div
            className={cn(
              "absolute z-[100001] top-0 left-0 w-1 border-l-1 border-l-zinc-600 cursor-ew-resize",
              commonStyles,
            )}
            onMouseDown={(e) => {
              e.preventDefault();
              setDrag(true);
              document.addEventListener('mousemove', onDrag);
              document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', onDrag);
                setDrag(false);
              }, {once: true});
            }}
          />
        </div>
        <div>
          {/* Content */}
          {isOpen && <div className="p-4">{children}</div>}
        </div>
      </div>
    </>
  );
};
