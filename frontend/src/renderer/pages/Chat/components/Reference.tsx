import React, { useState } from 'react';
import { Modal } from '@mantine/core';
import { apiCall } from '../../../utils/api';

const ShowReference: React.FC<{ referenceId: string }> = ({ referenceId }) => {
  const [opened, setOpened] = useState(false);
  const [data, setData] = useState('');

  const fetchData = async () => {
    try {
      const response = await apiCall(`/files/${referenceId}`, 'GET');
      const contentLines = response.data.content; // Access the "content" property, which is an array of lines
    const content = contentLines.join('\n'); // Join the lines into a single string with line breaks
    setData(content);
      setOpened(true);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  return (
    <>
      <button onClick={fetchData}>Show Reference</button>
      <Modal opened={opened} onClose={() => setOpened(false)} title="Authentication" centered>
  <div>
    <p>Status: {data}</p>
    {/* Add more properties as needed */}
  </div>
</Modal>

      console.log(data);
    </>
  );
};

export default ShowReference;
