import {useState, useEffect, useRef} from 'react';
import './chat.css';
import {apiCall} from '../../utils/api';
import {Message} from 'renderer/utils';
import Question from './components/Question';
import Answer from './components/Answer';
import {IconSend, IconTrash, IconArrowUp} from '@tabler/icons-react';
import {Modal, Select, Switch} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import Block from './components/Block';

type FileData = {
    name: string;
    type: string;
    size: number;
};

function Chat() {
    const [queue, setQueue] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [lastQuestion, setLastQuestion] = useState('');
    const [error, setError] = useState(false);
    const [input, setInput] = useState('');
    const discussionRef = useRef<HTMLDivElement>(null);
    const [useBrain, setUseBrain] = useState(true);


    // used for the specific_document chat
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    useEffect(() => {
        const chatData = localStorage.getItem('queue');
        if (chatData) {
            setQueue(JSON.parse(chatData));
        } else {
            setQueue([]);
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [queue, input]);

    const deleteDiscussion = () => {
        setQueue([]);
        localStorage.removeItem('queue');
        close();
    };

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
        });
    };


    const sendMessage = async () => {
        setLastQuestion(input);
        setInput('');
        setIsLoading(true);
        setError(false);

        try {
            // const response = await axios.post(
            //     `${config.REACT_APP_BACKEND_URL}/chat`,
            //     {
            //         question: {
            //             question: input,
            //         },
            //         document: {
            //             document: selectedFile,
            //         },
            //     }
            // );
            const response = await apiCall('/chat', 'POST', {
                question: {
                    question: input,
                },
                document: {
                    document: selectedFile,
                },
                usebrain: useBrain,
            });
            const data = response.data;

            setQueue((prevQueue: Message[]) => [
                ...prevQueue,
                {question: input, answer: data.answer, metadata: data.meta_data},
            ]);
        } catch (error) {
            setError(true);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (queue) {
            localStorage.setItem('queue', JSON.stringify(queue));
        }
    }, [queue]);

    const [files, setFiles] = useState<string[]>([]);

    useEffect(() => {
    //     axios
    //         .get<FileData[]>(
    //             `${config.REACT_APP_BACKEND_URL}/files`
    //         )
    //         .then((response) => {
    //             const fetchedFiles = response.data;
    //             console.log("Fetched files:", fetchedFiles);
    //             if (fetchedFiles.length > 0) {
    //                 const fileNames = fetchedFiles.map(file => file.name);
    //                 console.log("File names:", fileNames);
    //                 setFiles(fileNames);
    //             }
    //         })
    //         .catch((error) => {
    //             console.log('Error fetching config:', error);
    //         });
    // }, []);
        apiCall('/files', 'GET', {}).then((response) => {
            const fetchedFiles = response.data;
            console.log("Fetched files:", fetchedFiles);
            if (fetchedFiles.length > 0) {
                const fileNames = fetchedFiles.map(file => file.name);
                console.log("File names:", fileNames);
                setFiles(fileNames);
            }
        })
        .catch((error) => {
            console.log('Error fetching config:', error);
        });
    }, []);


    const [opened, {open, close}] = useDisclosure(false);
    const up = () => {
        window.scrollTo(0, 0);
    };

    return (
        <div className="chat_container">
            <div onClick={open} className="delete_discussion">
                <IconTrash color="white"/>
            </div>
            <div onClick={up} className="arrow_up">
                <IconArrowUp color="white"/>
            </div>
            <div className={'switch'}>
                AIxplora brain
                <Switch
                    onLabel="ON" offLabel="OFF" defaultChecked="true"
                    onClick={() => { setUseBrain(!useBrain) }}
                />
                </div>
            <Modal.Root opened={opened} onClose={close}>
                <Modal.Overlay/>
                <Modal.Content>
                    <Modal.Header>
                        <Modal.Title>Delete the discussion</Modal.Title>
                        <Modal.CloseButton/>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            Are you sure you want to delete the discussion? this action is
                            irreversible
                        </p>
                        <button
                            onClick={deleteDiscussion}
                            style={{backgroundColor: '#228be6', color: 'white'}}
                        >
                            Delete
                        </button>
                    </Modal.Body>
                </Modal.Content>
            </Modal.Root>
            <div className="specific_document">
                <Select
                    placeholder="Choose a file to Chat with or AIxplora will give you the most relevant answer"
                    data={files.map((file, index) => ({value: file, label: file, key: index}))}
                    style={{width: 800}}
                    onChange={(value) => setSelectedFile(value)}

                />
            </div>
            <div ref={discussionRef} className="discussion">
                {queue.map((message, index) => (
                    <Block question={message.question} answer={message.answer} metadata={message.metadata}
                           key={index}/>
                ))}
                {isLoading ? (
                    <div className="temp_question">
                        <Question content={lastQuestion}/> <Answer isLoading={true}/>
                    </div>
                ) : null}
            </div>
            <div className="user_input">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="what is the meaning of life"
                    type="text"
                    name="question"
                    id="question"
                    onKeyDown={(event) => {
                        if (input.length != 0 || isLoading) {
                            if (event.key === 'Enter') {
                                sendMessage();
                            }
                        }
                    }}
                />
                <div
                    onClick={() => {
                        if (input.length != 0 || isLoading) {
                            sendMessage();
                        }
                    }}
                    className="question_submit"
                >
                    <IconSend/>
                </div>
            </div>
        </div>
    );
}

export default Chat;
