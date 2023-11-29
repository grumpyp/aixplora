import React, {useEffect, useState} from 'react';
import {DropzoneButton} from "./components/Dropzone";
import UploadedTable from "./components/Uploaded";
import Urlloader from "./components/Urlloader";
import {apiCall} from "../../utils/api";
import {useSelector} from "react-redux";

type FileData = {
    name: string;
    type: string;
    size: number;
};

export function Upload() {
    // React state to store the files
    const [files, setFiles] = useState<FileData[]>([]);

    // Callback function to update the files state when files are added in the Dropzone and Urlloader component
    const handleFilesUploaded = (uploadedFiles: (File[] | string[])) => {
        const newFiles: FileData[] = uploadedFiles.map((item) => {
            if (typeof item === 'string') {
                // Convert string to FileData object
                return {
                    name: item,
                    type: 'website', 
                    size: 0  // Placeholder
                };
            } else {
                // If it's already a FileData object, keep it as is
                return item;
            }
        });

        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    };

    // useEffect(() => { // Using useEffect hook to call API on component mount
    //     axios.get<FileData[]>(`${config.REACT_APP_BACKEND_URL}/files`)
    //         .then((response) => {
    //             const fetchedFiles = response.data;
    //             console.log(fetchedFiles);
    //             if (fetchedFiles.length > 0) {
    //                 setFiles(fetchedFiles); // Setting state when data is fetched
    //             }
    //         })
    //         .catch((error) => {
    //             console.log('Error fetching config:', error);
    //         });
    // }, []); // The empty array makes this run on mount only

    useEffect(() => {
        apiCall('/files/', 'GET').then((response) => {
            const fetchedFiles = response.data;
            console.log(fetchedFiles);
            console.log('feched');
            if (fetchedFiles.length > 0) {
                setFiles(fetchedFiles); // Setting state when data is fetched
                console.log("saved files");
                console.log(files);
            }
        })
        .catch((error) => {
            console.log('Error fetching config:', error);
            setFiles([])
        });
    }, []);

    return (
        <div style={{marginTop: '-100px'}}>
            <Urlloader onFilesUploaded={handleFilesUploaded}/>
            <DropzoneButton onFilesUploaded={handleFilesUploaded}/> 
            <UploadedTable data={files}/>
        </div>
    );
}

export default Upload;


