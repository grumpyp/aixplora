import {Container, Paper, PasswordInput, TextInput, Anchor, Group, Button} from "@mantine/core";
import { connect, disconnect } from '../../store/slices/externalDbSlice';
import { useSelector, useDispatch } from 'react-redux';


export default function ExternalDb() {
    const dispatch = useDispatch();
    const isConnected = useSelector((state) => state.connectedExternalDb.value);


    return (
        <div>
            This feature is still under development.
            <Container>
                <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                    <TextInput label="E-Mail" placeholder="info@aixplora.app" required/>
                    <PasswordInput label="API-Key" placeholder="Your API-Key" required mt="md"/>
                    <Group position="apart" mt="lg">
                        <Anchor component="button" size="sm">
                            Create a shared Knowledgebase
                        </Anchor>
                    </Group>
                    <Button fullWidth mt="xl" onClick={() => dispatch(connect())}>
                        Conntect
                    </Button>
                </Paper>
            </Container>
        </div>
    )
}
