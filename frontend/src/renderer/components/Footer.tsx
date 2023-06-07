import { createStyles, Container, Group, ActionIcon, rem } from '@mantine/core';
import {
  IconBrandDiscord,
  IconBrandGithub,
  IconBrandYoutube,
} from '@tabler/icons-react';

import '../styles/components.css'


const useStyles = createStyles((theme) => ({


 
}));

export function Footer() {
  const { classes } = useStyles();

  return (
    <div className="footer">
      <Container >
        <b style={{fontFamily:"sans-serif", fontWeight: "500"}}>Version 0.0.1</b>
        <Group spacing={0}    position="right" noWrap>
          <a href="https://discord.gg/YTEKxEF2" target="_blank" rel="noopener noreferrer">
            <ActionIcon size="lg">
              <IconBrandDiscord color='#fffcf2' size="1.5rem" stroke={1.5} />
            </ActionIcon>
          </a>
          <a href="https://www.youtube.com/@patrick-gerard/videos" target="_blank" rel="noopener noreferrer">
            <ActionIcon size="lg">
              <IconBrandYoutube color='#fffcf2' size="1.5rem" stroke={1.5} />
            </ActionIcon>
          </a>
          <a href="https://github.com/grumpyp/aixplora" target="_blank" rel="noopener noreferrer">
            <ActionIcon size="lg">
              <IconBrandGithub color='#fffcf2' size="1.5rem" stroke={1.5} />
            </ActionIcon>
          </a>
        </Group>
      </Container>
    </div>
  );
}

export default Footer;
