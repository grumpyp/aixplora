import { useState, useEffect } from 'react';
import { Select, Button, Box } from '@mantine/core';
import axios from 'axios';
import {config} from '../../config.js';
import {apiCall} from "../../utils/api";
import Answer from './components/Answer';

type SummaryResponse = {
  summary: string;
  summary_list?: string;
}

export function Summary() {
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [lastAnswer, setLastAnswer] = useState('');
  const [summaryList, setSummaryList] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [requestFired, setRequestFired] = useState(false);

  const summarizeDocument = async () => {
    setIsLoading(true);
    console.log("Summarizing document:", selectedFile);
    try {
      // const response = await axios.post<SummaryResponse>(
      //   `${config.REACT_APP_BACKEND_URL}/summarize`,
      //   {
      //     document: selectedFile,
      //   }
      // );
        const response = await apiCall('/summarize', 'POST', {
            document: selectedFile,
        });
      const data = response.data;
      setLastAnswer(data.summary);
      setSummaryList(data.summary_list !== 'No additional references' ? data.summary_list : undefined);
      setRequestFired(true);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
  //   axios
  //     .get(
  //       `${config.REACT_APP_BACKEND_URL}/files`
  //     )
  //     .then((response) => {
  //       const fetchedFiles = response.data.map(file => file.name);
  //       setFiles(fetchedFiles);
  //     })
  //     .catch((error) => {
  //       console.log('Error fetching config:', error);
  //     });
  // }, []);
  apiCall('/files', 'GET').then((response) => {
    const fetchedFiles = response.data.map(file => file.name);
    setFiles(fetchedFiles);
  }
    ).catch((error) => {
        console.log('Error fetching config:', error);
        });
    }, []);

  return (
    <Box maw={920} mx="auto">
      <Select
        placeholder="Which file you want to summarize?"
        data={files.map((file, index) => ({ value: file, label: file, key: index }))}
        onChange={(value) => setSelectedFile(value)}
      />
      <Button type="submit" mt="sm" onClick={summarizeDocument}>
        Summarize
      </Button>
      <Answer content={lastAnswer} summaryList={summaryList} isLoading={isLoading} requestFired={requestFired} />
    </Box>
  );
}

export default Summary;
