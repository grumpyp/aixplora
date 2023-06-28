import {useForm} from '@mantine/form';
import {TextInput, Button, Box, Drawer, Avatar, Text, Group, Select, Tooltip} from '@mantine/core';
import {config} from '../../config.js';
import {IconDatabase} from '@tabler/icons-react';
import {useDisclosure} from '@mantine/hooks';
import ExternalDb from './Externaldb';
import logo from '../../components/assets/AIxplora_logo_round.png';
import {useSelector, useDispatch} from 'react-redux';
import {connect, disconnect} from '../../store/slices/externalDbSlice';
import {apiCall} from "../../utils/api";
import {useState} from "react";


function saveConfig(OPENAI_API_KEY: string, model: string) {
    const payload = {
        apiKey: OPENAI_API_KEY,
        model: model
    };
//     return axios.post(`${config.REACT_APP_BACKEND_URL}/config`, payload)
//         .then((response) => {
//             const fetchedConfig = response.data;
//
//             if (Object.keys(fetchedConfig).length === 0) {
//                 return false;
//             }
//
//             // The fetched config is not an empty object, save it and return true
//             localStorage.setItem('config', JSON.stringify(fetchedConfig));
//             console.log(fetchedConfig);
//             window.location.reload();
//
//             return true;
//         })
//         .catch((error) => {
//             console.log('Error fetching config:', error);
//             return false;
//         });
// }
    return apiCall('/config', 'POST', payload).then((response) => {
            const fetchedConfig = response.data;
            console.log(fetchedConfig);

            if (Object.keys(fetchedConfig).length === 0) {
                return false;
            }

            // The fetched config is not an empty object, save it and return true
            localStorage.setItem('config', JSON.stringify(fetchedConfig));
            console.log(fetchedConfig);
            window.location.reload();

            return true;
        }
    )
        .catch((error) => {
                console.log('Error fetching config:', error);
                return false;
            }
        );
}

function Config() {
    const isConnected = useSelector((state) => state.connectedExternalDb.value);
    const dispatch = useDispatch();
    const [opened, {open, close}] = useDisclosure(false);
    const [focused, setFocused] = useState(false);


    const form = useForm({
        initialValues: {
            OPENAI_API_KEY: '',
            model: ''
        },

        validate: {
            OPENAI_API_KEY: (value, values) => {
                const modelValue = values.model;
                // Huggingface embeddings will activate huggingface embeddings to be completly independent of
                // OpenAI. It's not implemented as of now 28.05.2023
                if (!modelValue.startsWith("huggingfaceembeddings")) {
                    return value.startsWith("sk-") ? null : "Invalid API Key";
                }
                return null;
            },
            model: (value) => (value ? null : "Choose a model")
        },
    });


    const handleSuccess = (values) => {
        console.log(values);
        saveConfig(values.OPENAI_API_KEY, values.model);
    };

    const handleFail = (errors) => {
        console.log(errors);
    };

    const handleClick = () => {
        if (isConnected) {
            dispatch(disconnect());
        } else {
            open();
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
                               <Tooltip label="An OpenAI key is mandatory for the embeddings even if using a open-source LLM " position="top-start" opened={focused}>
                                   {children}
                               </Tooltip>
                           )}/>
                <Select
                    label="OPENAI Model"
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
                <Button type="submit" mt="sm">
                    Save
                </Button>
            </form>
            <br/>
            <Drawer opened={opened} onClose={close} title="Authentication">
                <ExternalDb/>
            </Drawer>

            <Button leftIcon={<IconDatabase size="1rem"/>} loaderPosition="right" onClick={handleClick}>
                {isConnected ? "Connect Local-knowledge" : "Connect to database"}
            </Button>
        </Box>
    );
}

export default Config;
