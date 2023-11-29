import {useForm} from '@mantine/form';
import {useEffect, useState} from 'react'; // Combine imports of 'useEffect' and 'useState'
import {TextInput, Button, Box, Drawer, Avatar, Text, Group, Select, Tooltip} from '@mantine/core';
import {IconDatabase} from '@tabler/icons-react';
import {useDisclosure} from '@mantine/hooks';
import ExternalDb from './Externaldb';
import logo from '../../components/assets/AIxplora_logo_round.png';
import {useSelector, useDispatch} from 'react-redux';
import {connect, disconnect} from '../../store/slices/externalDbSlice';
import {apiCall} from "../../utils/api";
import PromptConfiguration from "./PromptConfig";
import {Notifications} from '@mantine/notifications';
import {ErrorNotification} from "../../../renderer/components/ErrorNotification";

async function saveConfig(OPENAI_API_KEY, model, embeddingsmodel) {
    const payload = {
        apiKey: OPENAI_API_KEY,
        model: model,
        embeddingsModel: embeddingsmodel
    };

    try {
        // Validate API key
        const apiKeyValidationResponse = await apiCall('/config/validate-api-key', 'POST', payload);

        if (apiKeyValidationResponse?.data.validApiKey === false) {
            ErrorNotification('/config/validate-api-key', 'POST', apiKeyValidationResponse?.data.message, 'Invalid OpenAI API Key');
            return false;
        }

        // If the API key is valid, proceed to save the configuration
        const configSaveResponse = await apiCall('/config', 'POST', payload);

        if (configSaveResponse) {
            const fetchedConfig = configSaveResponse.data;

            if (Object.keys(fetchedConfig).length === 0) {
                return false;
            }

            // The fetched config is not an empty object, save it and return true
            localStorage.setItem('config', JSON.stringify(fetchedConfig));
            return true;
        } else {
            console.log('Invalid response format:', configSaveResponse);
            return false;
        }
    } catch (error) {
        console.log('Error during API calls:', error);
        return false;
    }
}

function Config({setConfigValid}) {
    const isConnected = useSelector((state) => state.connectedExternalDb.value);
    const dispatch = useDispatch();
    const [focused, setFocused] = useState(false);
    const [opened, setOpened] = useState(false);


    const form = useForm({
        initialValues: {
            OPENAI_API_KEY: '',
            model: '',
            embeddingsmodel: '',
        },

        validate: {
            OPENAI_API_KEY: (value, values) => {
                const modelValue = values.model;
                const embeddingsmodelValue = values.embeddingsmodel;
                if (embeddingsmodelValue.startsWith("text-")) {
                    return value.startsWith("sk-") ? null : "Invalid API Key";
                }
                return null;
            },
            model: (value) => (value ? null : "Choose a model"),
            embeddingsmodel: (value) => (value ? null : "Choose an embeddings model"),
        },
    });

    // Load the saved configuration from the local storage
    useEffect(() => {
        try {
            const savedConfig = JSON.parse(localStorage.getItem('config') || '{}');
            form.setValues({
                OPENAI_API_KEY: savedConfig.openai_api_key || savedConfig.apiKey || '',
                model: savedConfig.model || '',
                embeddingsmodel: savedConfig.embeddings_model || savedConfig.embeddingsModel || '',
            });
        } catch (error) {
            console.error('Error parsing saved configuration:', error);
        }
    }, []);

    const handleSuccess = async (values) => {
        const success = await saveConfig(values.OPENAI_API_KEY, values.model, values.embeddingsmodel);
        if (success) {
            Notifications.show({
                title: 'Configuration Saved',
                message: 'Your configuration has been saved successfully.',
                color: 'green',
            });
        } else {
            Notifications.show({
                title: 'Configuration Error',
                message: 'There was an error saving your configuration.',
                color: 'red',
            });
        }
    };

    const handleFail = (errors) => {
        console.log(errors);
    };


    const closeDrawer = () => {
        setOpened(false);
    };

    const handleClick = () => {
        if (isConnected) {
            dispatch(disconnect());
        } else {
            setOpened(true); // Open the drawer
        }
    };


    return (
        <Box maw={320} mx="auto">
            <Group>
                <Avatar src={logo} radius="xl"/>
                <div style={{flex: 1}}>
                    <Text size="sm" weight={500}>
                        {isConnected ? "conntected to cloud" : "connected locally"}
                    </Text>
                </div>
            </Group>
            <form onSubmit={form.onSubmit(handleSuccess, handleFail)}>
                <TextInput mt="sm" label="OPENAI API Key"
                           placeholder="OPENAI API Key" {...form.getInputProps('OPENAI_API_KEY')}
                           onFocus={() => setFocused(true)}
                           onBlur={() => setFocused(false)}
                           inputContainer={(children) => (
                               <Tooltip
                                   label="An OpenAI key is mandatory if you're using the text-embedding-ada-002 Embedding model"
                                   position="top-start" opened={focused}>
                                   {children}
                               </Tooltip>
                           )}/>
                <Select
                    label="LLM Model"
                    placeholder="gpt3.5-turbo"
                    {...form.getInputProps('model')}
                    data={[
                        {value: 'gpt-3.5-turbo', label: 'gpt-3.5-turbo'},
                        {value: 'gpt-3.5-turbo-16k', label: 'gpt-3.5-turbo-16k'},
                        {value: 'gpt-4', label: 'gpt-4'},
                        {value: 'gpt-4-32k', label: 'gpt-4-32k'},
                        {value: 'ggml-gpt4all-j-v1.3-groovy', label: 'ggml-gpt4all-j-v1.3-groovy'},
                        {value: 'ggml-mpt-7b-instruct', label: 'ggml-mpt-7b-instruct'},
                    ]}
                />
                <Select
                    label="Embeddings Model"
                    placeholder="text-embedding-ada-002"
                    {...form.getInputProps('embeddingsmodel')}
                    data={[
                        {value: 'text-embedding-ada-002', label: 'text-embedding-ada-002'},
                        {value: 'all-MiniLM-L6-v2', label: 'all-MiniLM-L6-v2'},
                        {value: 'multi-qa-MiniLM-L6-cos-v1', label: 'multi-qa-MiniLM-L6-cos-v1'},
                        {value: 'paraphrase-albert-small-v2', label: 'paraphrase-albert-small-v2'},
                        {value: 'multi-qa-mpnet-base-dot-v1 ', label: 'multi-qa-mpnet-base-dot-v1'},
                    ]}
                />
                <Button type="submit" mt="sm">
                    Save
                </Button>
            </form>
            <br/>
            <Drawer opened={opened} onClose={() => setOpened(false)} title="Authentication">
                <ExternalDb onClose={closeDrawer}/>
            </Drawer>


            <Button leftIcon={<IconDatabase size="1rem"/>} loaderPosition="right" onClick={handleClick}>
                {isConnected ? "Connect Local-knowledge" : "Connect to database"}
            </Button>
            <PromptConfiguration></PromptConfiguration>
        </Box>
    );
}

export default Config;
