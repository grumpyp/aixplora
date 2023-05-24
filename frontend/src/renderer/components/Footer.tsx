import { createStyles, Container, Group, ActionIcon, rem } from '@mantine/core';
import { IconBrandGithub, IconBrandYoutube, IconBrandInstagram, IconBrandDiscord } from '@tabler/icons-react';
import { MantineLogo } from '@mantine/ds';

const useStyles = createStyles((theme) => ({
  footer: {
    position: 'fixed',
    left: 0,
    right: 0,
    backgroundColor: theme.white,

    bottom: 0,
    borderTop: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
      }`,
  },

  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,

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

export function Footer() {
  const { classes } = useStyles();

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <b>Version 0.0.1</b>
        <Group spacing={0} className={classes.links} position="right" noWrap>
          <a href="https://github.com/grumpyp/aixplora"><ActionIcon size="lg">
            <IconBrandGithub color='black' size="1.5rem" stroke={1.5} />
          </ActionIcon></a>
          <a href="https://www.youtube.com/@patrick-gerard/videos"><ActionIcon size="lg">
            <IconBrandYoutube color='black' size="1.5rem" stroke={1.5} />
          </ActionIcon></a>
          <a href="https://discord.gg/M2AuGZvgHq"><ActionIcon size="lg">
            <IconBrandDiscord color='black' size="1.5rem" stroke={1.5} />
          </ActionIcon></a>
        </Group>
      </Container>
    </div>
  );
}

export default Footer;
