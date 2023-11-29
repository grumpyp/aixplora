import {useDisclosure} from '@mantine/hooks';
import {Modal, Group, Button, Textarea, Box} from '@mantine/core';
import {IconSettings} from "@tabler/icons-react";
import {useState, useEffect} from 'react';
import {apiCall} from "../../utils/api";
import {Notifications} from "@mantine/notifications";

function PromptConfiguration() {
    const [opened, {open, close}] = useDisclosure(false);
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
        apiCall('/prompt', 'POST', {prompt: prompt}).then((response: any) => {
            const fetchedPrompt = response.data.prompt;
            console.log(fetchedPrompt);
            setPrompt(fetchedPrompt['prompt']);
            Notifications.show({title: 'Prompt set', message: 'The prompt was set successfully', color: 'green'})
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
                <Box style={{fontSize: '10px'}}>
                    Available placeholders:
                    <ul>
                        <li>{'{question}'}: The question that is asked</li>
                        <li>{'{relevant_docs}'}: The relevant documents that are used to generate the answer</li>
                    </ul>
                </Box>
                <Textarea
                    label="Your current prompt:"
                    value={prompt}
                    onChange={(event) => setPrompt(event.currentTarget.value)}
                    autosize
                    minRows={2}
                    maxRows={4}
                    style={{paddingBottom: '10px'}}
                />
                <Button onClick={setPromptDb} style={{marginRight: '10px'}}>Set prompt</Button>
                <Button
                    onClick={() => setPrompt("Answer the following question: {question} based on that context: {relevant_docs}," +
                        " make sure that the answer of you is in the same language then the question." +
                        " if you can't just answer: I don't know.")}>Reset prompt</Button>
            </Modal>

            <Group style={{paddingTop: '25px'}}>
                <Button leftIcon={<IconSettings size="1rem"/>} loaderPosition="right" onClick={open}>Prompt
                    settings</Button>
            </Group>
        </>
    );
}

export default PromptConfiguration;
