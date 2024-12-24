'use client';
import { Button } from '@nextui-org/button';
import { Mode } from '@/lib/types';

export const ModeButton = ({
  currentMode, mode, children, changeMode
}: {
  currentMode: Mode;
  mode: Mode;
  children: string;
  changeMode: (mode: Mode) => void;
}) => {
  const isActive = currentMode == mode;

  const color = isActive ? 'primary' : 'default';

  return (
    <Button
      onClick={() => changeMode(mode)}
      color={color}
      size="sm"
      radius="full"
      className="mr-3"
    >
      {children}
    </Button>
  );
};
