import { useEffect, useState } from 'react';
import { createStyles, Table, ScrollArea, rem, Button } from '@mantine/core';
import axios from 'axios';
import config from '../../../config';
import { FileFormat, RootState } from 'renderer/Data';

import { useDispatch, useSelector } from 'react-redux'; 
import { addFile, currentFIles, removeFile } from 'renderer/features/fileSplice';

const useStyles = createStyles((theme) => ({
  header: {
    position: 'sticky',
    top: 0,
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    transition: 'box-shadow 150ms ease',

    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `${rem(1)} solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[3]
          : theme.colors.gray[2]
      }`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));





export default function UploadedTable() {
  const dispatch = useDispatch();
  let currentFiles: FileFormat[] = useSelector((state: RootState) => state.files);

  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);

  const [files, setFiles] = useState<FileFormat[]>([]); // React state to store the files

  useEffect(() => {
    // Using useEffect hook to call API on component mount
    axios
      .get<FileFormat[]>(`${config.REACT_APP_BACKEND_URL}/files`)
      .then((response) => {
        const fetchedFiles = response.data;
        console.log(fetchedFiles);
        if (fetchedFiles.length > 0) {
          dispatch(addFile(fetchedFiles))
          setFiles(fetchedFiles)
        }
      })
      .catch((error) => {
        console.log('Error fetching config:', error);
      });
  }); // The empty array makes this run on mount only


  const handleDelete = async (row: FileFormat) => {
    await axios
      .delete(`${config.REACT_APP_BACKEND_URL}/files/`, {
        data: { file: row.name },
      })
      .then(() => {
        const updatedData = files.filter((item) => item.name !== row.name);
        dispatch(removeFile(row.name))
        setFiles(updatedData);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const rows = files.map((row) => (
    <tr key={row.name}>
      <td>{row.name}</td>
      <td>{row.type}</td>
      <td>{Math.floor(row.size / 1000)} kb</td>
      <td>
        <Button onClick={() => handleDelete(row)} color="red">
          delete
        </Button>
      </td>
    </tr>
  ));

  return (
    <ScrollArea
      h={300}
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
    >
      <Table miw={700}>
        <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
          <tr>
            <th>name</th>
            <th>type</th>
            <th>size</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}
