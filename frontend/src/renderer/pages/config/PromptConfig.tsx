import { useDisclosure } from '@mantine/hooks';
import { Modal, Group, Button, Textarea } from '@mantine/core';
import {IconSettings} from "@tabler/icons-react";
import {useState, useEffect} from 'react';
import {apiCall} from "../../utils/api";

function PromptConfiguration() {
  const [opened, { open, close }] = useDisclosure(false);
  const [prompt, setPrompt] = useState('');

  const getPrompt = () => {
      apiCall('/prompt', 'GET').then((response: any) => {
          const fetchedPrompt = response.data;
          console.log(fetchedPrompt);
          setPrompt(fetchedPrompt['prompt']);
      }).catch((error) => {
          console.log('Error fetching prompt:', error);
      });
  };

  const setPromptDb = () => {
        apiCall('/prompt', 'POST', {'prompt': prompt}).then((response: any) => {
            const fetchedPrompt = response.data;
            console.log(fetchedPrompt);
            setPrompt(fetchedPrompt['prompt']);
        }).catch((error) => {
            console.log('Error fetching prompt:', error);
        });
  }

  useEffect(() => {
      if (opened) {
          getPrompt();
      }
  }, [opened]);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Prompt Settings">
           <Textarea
        label="Your current prompt:"
        value={prompt}
        onChange={(event) => setPrompt(event.currentTarget.value)}
        autosize
        minRows={2}
        maxRows={4}
        style={{paddingBottom: '10px'}}
      />
          <Button onClick={setPromptDb}>Set prompt</Button>
      </Modal>

      <Group style={{paddingTop: '25px'}}>
        <Button leftIcon={<IconSettings size="1rem"/>} loaderPosition="right" onClick={open}>Prompt settings</Button>
      </Group>
    </>
  );
}

export default PromptConfiguration;
