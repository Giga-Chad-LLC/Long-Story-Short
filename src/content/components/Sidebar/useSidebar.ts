import { useState } from 'react';

interface UseSidebarProps {
  initialWidth: number
  minWidth: number
  maxWidth: number
}

export function useSidebar({
  initialWidth,
  minWidth,
  maxWidth,
}: UseSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [width, setWidth] = useState(initialWidth);

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
