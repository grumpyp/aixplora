import { createStyles, Container, Group, ActionIcon, rem } from '@mantine/core';
import {
  IconBrandDiscord,
  IconBrandGithub,
  IconBrandYoutube,
} from '@tabler/icons-react';
import DarkModeButton from './DarkModeButton';

type FooterProps = {
  toggleTheme: () => void;
  colorScheme: string;
};

const useStyles = createStyles((theme) => ({
  footer: {
    position: 'fixed',
    left: 0,
    right: 0,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],

    bottom: 0,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },

  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.xs,

    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column',
    },
  },

  links: {
    [theme.fn.smallerThan('xs')]: {
      marginTop: theme.spacing.md,
    },
  },
}));

export function Footer({ toggleTheme, colorScheme }: FooterProps) {
  const { classes } = useStyles();

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <b style={{fontFamily:"sans-serif", fontWeight: "500"}}>Version 0.0.1</b>
        <Group spacing={0} className={classes.links} position="right" noWrap>
          <DarkModeButton toggleTheme={toggleTheme} colorScheme={colorScheme}/>
          <a href="https://discord.gg/YTEKxEF2" target="_blank" rel="noopener noreferrer">
            <ActionIcon size="lg">
              <IconBrandDiscord color={colorScheme === "light" ? "black" : "white"} size="1.5rem" stroke={1.5} />
            </ActionIcon>
          </a>
          <a href="https://www.youtube.com/@patrick-gerard/videos" target="_blank" rel="noopener noreferrer">
            <ActionIcon size="lg">
              <IconBrandYoutube color={colorScheme === "light" ? "black" : "white"} size="1.5rem" stroke={1.5} />
            </ActionIcon>
          </a>
          <a href="https://github.com/grumpyp/aixplora" target="_blank" rel="noopener noreferrer">
            <ActionIcon size="lg">
              <IconBrandGithub color={colorScheme === "light" ? "black" : "white"} size="1.5rem" stroke={1.5} />
            </ActionIcon>
          </a>
        </Group>
      </Container>
    </div>
  );
}

export default Footer;
