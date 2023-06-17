import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import UploadedTable from '../../../renderer/pages/file-upload/components/Uploaded';

jest.mock('axios'); // Mock the axios module

describe('UploadedTable', () => {
  beforeEach(() => {
    // Clear all mocked axios requests before each test
    axios.get.mockClear();
    axios.delete.mockClear();
  });

  test('displays rows with file data', async () => {
    const mockFiles = [
      { name: 'file1.txt', type: 'text/plain', size: 1000 },
      { name: 'file2.png', type: 'image/png', size: 500 },
    ];
    axios.get.mockResolvedValueOnce({ data: mockFiles });

    render(<UploadedTable />);

    // Wait for the API call to resolve
    await screen.findByText('file1.txt');

    // Check if the rows are rendered with the correct data
    expect(screen.getByText('file1.txt')).toBeInTheDocument();
    expect(screen.getByText('text/plain')).toBeInTheDocument();
    expect(screen.getByText('1 kb')).toBeInTheDocument();
    expect(screen.getByText('file2.png')).toBeInTheDocument();
    expect(screen.getByText('image/png')).toBeInTheDocument();
    expect(screen.getByText('0.5 kb')).toBeInTheDocument();
  });

  test('calls delete API when delete button is clicked', async () => {
    const mockFiles = [
      { name: 'file1.txt', type: 'text/plain', size: 1000 },
      { name: 'file2.png', type: 'image/png', size: 500 },
    ];
    axios.get.mockResolvedValueOnce({ data: mockFiles });
    axios.delete.mockResolvedValueOnce();

    render(<UploadedTable />);

    // Wait for the API call to resolve
    await screen.findByText('file1.txt');

    // Click the delete button for the first file
    const deleteButton = screen.getAllByText('delete')[0];
    fireEvent.click(deleteButton);

    // Check if the delete API was called with the correct data
    expect(axios.delete).toHaveBeenCalledWith(
      expect.stringContaining('files/'),
      { data: { file: 'file1.txt' } }
    );
  });
});
