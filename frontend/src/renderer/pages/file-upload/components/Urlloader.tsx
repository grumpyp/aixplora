import { Box, TextInput, Button, Checkbox, Tooltip } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import './UrlLoader.css';
import { useState } from 'react';
import { apiCall } from '../../../utils/api';
import { useForm } from '@mantine/form';
import { Notifications } from '@mantine/notifications';

export function UrlLoader({ onFilesUploaded }: { onFilesUploaded: (uploadedFiles: string[]) => void }) {
  const [sitemap, setSitemap] = useState(false);

  const form = useForm({
      initialValues: { URL: '' },
      validate: {
        URL: (value) => {
          if (!value) {
            return 'URL is required';
          }
          if (!value.startsWith('http://') && !value.startsWith('https://')) {
            return 'URL must start with http:// or https://';
          }
          return null;
        },
      },
    });

  const handleSuccess = (values) => {
    
    handleUrlUpload();
    form.setFieldValue('URL', '');
  };

  const handleFail = (errors) => {
    console.log(errors);
  };

  const handleUrlUpload = () => {
    const payload = {
      website: form.values.URL,
      sitemap: sitemap,
    };
    
  apiCall('/files/website', 'POST', payload)
  .then((response) => {
      if (response.status === 200) {
          // URL Upload Successful
          Notifications.show({
              title: 'URL Upload Successful',
              message: 'The URL was successfully uploaded.',
              color: 'green',
          });

          // passing the website to the Upload.tsx component
          onFilesUploaded([payload.website]);
      } else if (response.status === 500) {
          // Upload Failed
          Notifications.show({
              title: 'Upload Failed',
              message: 'An error occurred during the upload. Please try again later.',
              color: 'red',
          });
      } else if (response.status === 404) {
          // Resource Not Found
          Notifications.show({
              title: 'Resource Not Found',
              message: 'The requested resource was not found.',
              color: 'red',
          });
      } else if (response.status === 401 || response.status === 403) {
          // Access Denied
          Notifications.show({
              title: 'Access Denied',
              message: 'You do not have permission to access this resource.',
              color: 'red',
          });
      } else if (response.status === 429) {
          // Rate Limit Exceeded
          Notifications.show({
              title: 'Rate Limit Exceeded',
              message: 'You have exceeded the rate limit for this service.',
              color: 'red',
          });
      } else if (response.status === 503) {
          // Service Temporarily Unavailable
          Notifications.show({
              title: 'Service Temporarily Unavailable',
              message: 'The service is temporarily unavailable due to maintenance or overload. Please try again later.',
              color: 'red',
          });
      } else {
          // Unknown Error
          Notifications.show({
              title: 'Unknown Error',
              message: 'An unknown error occurred. Please try again later.',
              color: 'red',
          });
      }
  })
  .catch((error) => {
      console.log('Error fetching config:', error);
  });
  }
  

  const [focused, setFocused] = useState(false);

  return (
    <div className="urlloader">
      <Box>
        <div>
          <form onSubmit={form.onSubmit(handleSuccess, handleFail)}>
            <TextInput
              style={{ flex: '1', margin: '0 5px' }}
              icon={<IconSearch size="1rem" />}
              placeholder="https://aixplora.app"
              {...form.getInputProps('URL')}
              size={'sm'}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              inputContainer={(children) => (
                <Tooltip
                  label="By enabling the checkbox, the whole sitemap of the website will be scraped and everything will be indexed. Note: This will probably take a while!"
                  position="top-start"
                  opened={focused}
                >
                  {children}
                </Tooltip>
              )}
            />
            <div style={{ display: 'flex', gap: '10px', margin: '5px 5px' }}>
              <Checkbox
                label={'Index whole sitemap'}
                style={{ marginTop: '10px' }}
                onChange={(event) => setSitemap(event.currentTarget.checked)}
              />
              <Button type="submit">Upload</Button>
            </div>
          </form>
        </div>
      </Box>
    </div>
  );
}

export default UrlLoader;