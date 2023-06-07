import {
  createStyles,
  Title,
  Text,
  Button,
  Container,
  rem,
} from '@mantine/core';
import '../styles/components.css';

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    paddingTop: rem(20),
    paddingBottom: rem(80),

    [theme.fn.smallerThan('sm')]: {
      paddingTop: rem(80),
      paddingBottom: rem(60),
    },
  },

  inner: {
    position: 'relative',
    zIndex: 1,
  },

  title: {
    textAlign: 'center',
    fontWeight: 800,
    fontSize: rem(40),
    letterSpacing: -1,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    marginBottom: theme.spacing.xs,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan('xs')]: {
      fontSize: rem(28),
      textAlign: 'left',
    },
  },

  highlight: {
    color:
      theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6],
  },

  description: {
    textAlign: 'center',

    [theme.fn.smallerThan('xs')]: {
      textAlign: 'left',
      fontSize: theme.fontSizes.md,
    },
  },

  controls: {
    marginTop: theme.spacing.lg,
    display: 'flex',
    justifyContent: 'center',

    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column',
    },
  },

  control: {
    '&:not(:first-of-type)': {
      marginLeft: theme.spacing.md,
    },

    [theme.fn.smallerThan('xs')]: {
      height: rem(42),
      fontSize: theme.fontSizes.md,

      '&:not(:first-of-type)': {
        marginTop: theme.spacing.md,
        marginLeft: 0,
      },
    },
  },
}));

export default function GettingStarted() {
  const { classes } = useStyles();

  return (
    <Container className="message_container" size={1400}>
      <div className={classes.inner}>
        <h2 className="title">
          Thanks for using <span className="highlight">AIxplora</span>- Enjoy 🎉
        </h2>

        <div>
          <p color="dimmed" className="description">
            Feel free to join our Discord server for help and support: <br />
            <a className="starter" href="https://discord.gg/2G778kHG">
              https://discord.gg/2Y8b8GJ
            </a>{' '}
            <br />
            <br />
            We also appreciate contributions to the project, so feel free to
            check out our GitHub page: <br />
            <a className="starter" href="https://github.com/grumpyp/aixplora/">
              https://github.com/grumpyp/aixplora/
            </a>
          </p>
        </div>
      </div>
    </Container>
  );
}
