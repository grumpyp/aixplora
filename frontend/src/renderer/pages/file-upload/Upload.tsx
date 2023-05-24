import React, { useEffect, useState } from 'react';
import { DropzoneButton } from "./components/Dropzone";
import UploadedTable from "./components/Uploaded";
import axios from "axios";
import config from "../../config";

type FileData = {
  name: string;
  type: string;
  size: number;
};

export function Upload() {
  const [files, setFiles] = useState<FileData[]>([]); // React state to store the files

  useEffect(() => { // Using useEffect hook to call API on component mount
    axios.get<FileData[]>(`${config.REACT_APP_BACKEND_URL}/files`)
      .then((response) => {
        const fetchedFiles = response.data;
        console.log(fetchedFiles);
        if (fetchedFiles.length > 0) {
          setFiles(fetchedFiles); // Setting state when data is fetched
        }
      })
      .catch((error) => {
        console.log('Error fetching config:', error);
      });
  }, []); // The empty array makes this run on mount only

  return (
    <div>
      <DropzoneButton />
      <UploadedTable data={files} />
    </div>
  );
}

export default Upload;
