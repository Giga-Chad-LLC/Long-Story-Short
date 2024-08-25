import React from 'react';
import { useSidebar } from './useSidebar';
import cn from "classnames";
import {CaretLeft, CaretRight} from "../../../shared/icons";

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
  const { isOpen, width, closeSidebar, openSidebar, handleResize } = useSidebar({
    initialWidth,
    minWidth,
    maxWidth,
  });

  // Handle the drag functionality for resizing the sidebar
  const onDrag = (e: MouseEvent) => {
    handleResize(window.innerWidth - e.clientX);
  };

  const sidebarStyles = "bg-white shadow-md shadow-lightgray"
  const commonStyles = "h-full";

  return (
    <>
      {isOpen ? (
        <div
          className={cn(
            "fixed top-0 right-0 z-50 overflow-auto",
            sidebarStyles,
            commonStyles,
          )}
          style={{ width }}
        >
          <div className="flex justify-end p-2">
            <CaretRight width={24} height={24} onClick={closeSidebar} />
          </div>

          {/* Content */}
          <div className="p-4">{children}</div>

          {/* Resize Handle */}
          <div
            className={cn(
              "absolute top-0 left-0 w-1 cursor-ew-resize",
              "bg-gray-500",
              commonStyles,
            )}
            onMouseDown={(e) => {
              e.preventDefault();
              document.addEventListener('mousemove', onDrag);
              document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', onDrag);
              }, { once: true });
            }}
          />
        </div>
      ) : (
        <div
          className={cn(
            "fixed top-0 right-0 z-50 w-[40px]",
            "border-l-4 border-gray-500",
            sidebarStyles,
            commonStyles,
          )}
        >
          <div className="flex justify-center pt-2">
            <CaretLeft width={24} height={24} onClick={openSidebar} />
          </div>
        </div>
      )}
    </>
  );
};
