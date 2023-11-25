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
import {apiCall} from "../../../utils/api";
import { Notifications } from '@mantine/notifications';
import axios from 'axios';
import appConfig from '../../../config';

const useStyles = createStyles((theme) => ({
  // Styles definition here
}));

export function DropzoneButton({ onFilesUploaded }: { onFilesUploaded: (uploadedFiles: File[]) => void }) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const { classes, theme } = useStyles();
  const openRef = useRef();
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

      axios.post(`${appConfig.REACT_APP_BACKEND_URL}/files/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      })
      .then((response) => {
        console.log(response.data);
        
        window.location.reload();
        setUploadProgress(0);  // Reset Progress Bar when done
      })
      .catch((error) => {
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
    <div className={classes.wrapper}>
      {selectedFiles.length > 0 && (
        <div className={classes.selectedFileWrapper}>
          <Text className={classes.selectedFileText}>
            {selectedFiles.length} file(s) selected
          </Text>
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

      <Dropzone
        openRef={openRef}
        onDrop={handleFileDrop}
        className={classes.dropzone}
        radius="md"
      >
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

      <Progress value={uploadProgress} color="blue" />

      {selectedFiles.length > 0 && (
        <Button
          className={classes.control}
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
