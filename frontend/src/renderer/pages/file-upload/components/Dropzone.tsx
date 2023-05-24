import { useRef, useState } from 'react';
import { Text, Group, Button, createStyles, rem } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { IconCloudUpload, IconX, IconDownload } from '@tabler/icons-react';
import axios from 'axios';
import config from '../../../config';

const useStyles = createStyles((theme) => ({
  // Styles definition here
}));

export function DropzoneButton() {
  const { classes, theme } = useStyles();
  const openRef = useRef();
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileDrop = (files) => {
    setSelectedFiles(files);
  };

const handleFileUpload = () => {
  if (selectedFiles.length > 0) {
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('files', file);
    });

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
  }
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
              <li key={index}>{item.name}</li>
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

      {selectedFiles.length > 0 && (
        <Button
          className={classes.control}
          size="md"
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
