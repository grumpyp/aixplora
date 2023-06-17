import React, { useEffect, useState } from 'react';
import { DropzoneButton } from './components/Dropzone';
import UploadedTable from './components/Uploaded';
import axios from 'axios';
import config from '../../config';



export function Upload() {


  return (
    <div>
      <DropzoneButton />
            <UploadedTable  />

    </div>
  );
}

export default Upload;
