import { Switch, useMantineTheme } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';

type DarkModeButtonProps = {
  toggleTheme: () => void;
  colorScheme: string;
};

function DarkModeButton({ toggleTheme, colorScheme }: DarkModeButtonProps) {
  const handleClick = () => {
    toggleTheme();
  };

  const theme = useMantineTheme();

  return (
    <Switch
      size="md"
      color={theme.colorScheme === 'dark' ? 'gray' : 'dark'}
      onLabel={<IconSun size="1rem" stroke={2.5} color={theme.colors.yellow[4]} />}
      offLabel={<IconMoonStars size="1rem" stroke={2.5} color={theme.colors.blue[6]} />}
      onChange={handleClick}
    />
  );
}

export default DarkModeButton;