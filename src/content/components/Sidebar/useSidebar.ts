import {useEffect, useState} from 'react';
import {useAtom} from "@reatom/npm-react";
import {sidebarWidthAtom} from "../../store/sidebarWidth.ts";

interface UseSidebarProps {
  minWidth: number
  maxWidth: number
}

export function useSidebar({
                             minWidth,
                             maxWidth,
                           }: UseSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [width, setWidth] = useAtom(sidebarWidthAtom);

  const openSidebar = () => setIsOpen(true);
  const closeSidebar = () => setIsOpen(false);
  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const handleResize = (newWidth: number) => {
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setWidth(newWidth);
    }
  };

  return {
    isOpen,
    width,
    openSidebar,
    closeSidebar,
    toggleSidebar,
    handleResize,
  };
}
