import React, { Dispatch, SetStateAction, useState } from 'react';

interface MobileToggleSidebarButtonProps {
  toolingNumber: number;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export default function MobileToggleSidebarButton({
  toolingNumber,
  setIsSidebarOpen,
}: MobileToggleSidebarButtonProps) {
  const [rotateChevron, setRotateChevron] = useState(false);
  const toggleRotate = () => setRotateChevron((prev) => !prev);
  const toggleSidebar = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    toggleRotate();
    setIsSidebarOpen((prev) => !prev);
  };
  const rotate = rotateChevron ? 'rotate(180deg)' : 'rotate(0)';

  return (
    <div className='bg-primary w-full h-12 mt-[4.5rem] relative lg:hidden'>
      <div
        className='px-8 w-full h-full flex justify-between items-center'
        onClick={toggleSidebar}
      >
        <h3 className='text-white'>{toolingNumber} Tools</h3>

        <svg
          style={{
            transform: rotate,
            transition: 'transform 0.2s linear',
          }}
          xmlns='http://www.w3.org/2000/svg'
          height='24'
          viewBox='0 0 256 512'
        >
          <path
            d='M64 448c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L178.8 256L41.38 118.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25l-160 160C80.38 444.9 72.19 448 64 448z'
            fill='#ffffff'
          />
        </svg>
      </div>
    </div>
  );
}
