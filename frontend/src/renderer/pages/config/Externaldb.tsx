import {Container, Paper, PasswordInput, TextInput, Anchor, Group, Button} from "@mantine/core";
import {connect, disconnect, setApiKey, setEmail} from '../../store/slices/externalDbSlice';
import {useSelector, useDispatch} from 'react-redux';
import {useState} from "react";


export default function ExternalDb({onClose}) {
    const isConnected = useSelector((state) => state.connectedExternalDb.value);
    const [apiKeyValue, setApiKeyValue] = useState('');
    const dispatch = useDispatch();
    const [emailValue, setEmailValue] = useState('');

    const handleConnect = () => {
        dispatch(connect());
        dispatch(setApiKey(apiKeyValue));
        dispatch(setEmail(emailValue));
        onClose();
    }


    return (
        <div>
            This feature is still under development.
            <Container>
                <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                    <TextInput label="E-Mail" placeholder="info@aixplora.app" required
                               onChange={e => setEmailValue(e.target.value)}/>
                    <PasswordInput label="API-Key" placeholder="Your API-Key" required mt="md"
                                   onChange={e => setApiKeyValue(e.target.value)}
                    />
                    <Group position="apart" mt="lg">
                        <Anchor component="button" size="sm">
                            <a href={"https://cloud.aixplora.app/"} target={"_blank"}>Create a shared Knowledgebase</a>
                        </Anchor>
                    </Group>
                    <Button fullWidth mt="xl" onClick={handleConnect}>
                        Conntect
                    </Button>
                </Paper>
            </Container>
        </div>
    )
}
