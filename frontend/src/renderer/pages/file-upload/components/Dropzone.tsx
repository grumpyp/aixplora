import { useEffect, useRef, useState } from 'react';
import {
  Text,
  Group,
  Button,
  createStyles,
  rem,
  ActionIcon,
} from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { IconCloudUpload, IconX, IconDownload } from '@tabler/icons-react';
import axios from 'axios';
import config from '../../../config';

const useStyles = createStyles((theme) => ({
  // Styles definition here
}));

export function DropzoneButton() {
  const { classes, theme } = useStyles();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    console.log(selectedFiles);
  }, [selectedFiles]);

  const handleFileDrop = async (files: File[]) => {
    const isSelected = selectedFiles.find((f) => f.name === files[0].name);
    if (!isSelected) {
      setSelectedFiles((prevSelectedFiles) => [...prevSelectedFiles, ...files]);
    }
  };

  const handleFileUpload = () => {
    if (selectedFiles.length > 0) {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('files', file);
      });
      setIsLoading(true);

      axios
        .post(`${config.REACT_APP_BACKEND_URL}/files/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          // Handle API response data
          console.log(response.data);
          window.location.reload();
        })
        .catch((error) => {
          // Handle API request error
          console.error(error);
        });
      setIsLoading(false);
    }
  };

  const removeSelectedFile = (fileName: string) => {
    const newFiles = selectedFiles.filter((file) => file.name !== fileName);
    setSelectedFiles(newFiles);
  };

  return (
    <div>
      {selectedFiles.length > 0 && (
        <div>
          <Text>{selectedFiles.length} file(s) selected</Text>
          <ul>
            {selectedFiles.map((item, index) => (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <li style={{ fontFamily: 'Poppins' }}>{item.name}</li>
                <ActionIcon
                  color="red"
                  data-testid="remove-button"
                  onClick={() => {
                    removeSelectedFile(item.name);
                  }}
                >
                  <IconX />
                </ActionIcon>
              </div>
            ))}
          </ul>
        </div>
      )}

      <Dropzone data-testid="dropzone" onDrop={handleFileDrop} radius="md">
        <div style={{ pointerEvents: 'none' }}>
          <Group position="center">
            <Dropzone.Accept>
              <IconDownload
                size={rem(50)}
                color={theme.colors[theme.primaryColor][6]}
                stroke={1.5}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size={rem(50)} color={theme.colors.red[6]} stroke={1.5} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconCloudUpload
                size={rem(50)}
                color={
                  theme.colorScheme === 'dark'
                    ? theme.colors.dark[0]
                    : theme.black
                }
                stroke={1.5}
              />
            </Dropzone.Idle>
          </Group>

          <Text
            ta="center"
            fw={700}
            fz="lg"
            mt={selectedFiles.length > 0 ? 'xl' : 0}
          >
            <Dropzone.Accept>Drop files here</Dropzone.Accept>
            <Dropzone.Idle>Select files</Dropzone.Idle>
          </Text>
          <Text ta="center" fz="sm" mt="xs" c="dimmed">
            Drag'n'drop files here to upload.
          </Text>
        </div>
      </Dropzone>

      {selectedFiles.length > 0 && (
        <Button
          size="md"
          style={{ margin: '1em 0' }}
          radius="xl"
          onClick={handleFileUpload}
        >
          Upload to API
        </Button>
      )}
    </div>
  );
}

export default DropzoneButton;
