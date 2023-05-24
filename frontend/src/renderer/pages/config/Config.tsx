import { useForm } from '@mantine/form';
import { TextInput, Button, Box } from '@mantine/core';
import axios from 'axios';
import config from '../../config.js';

function saveConfig(OPENAI_API_KEY) {
  const payload = {
    apiKey: OPENAI_API_KEY
  };
  return axios.post(`${config.REACT_APP_BACKEND_URL}/config`, payload)
    .then((response) => {
      const fetchedConfig = response.data;

      if (Object.keys(fetchedConfig).length === 0) {
        return false;
      }

      // The fetched config is not an empty object, save it and return true
      localStorage.setItem('config', JSON.stringify(fetchedConfig));
      console.log(fetchedConfig);
      window.location.reload();

      return true;
    })
    .catch((error) => {
      console.log('Error fetching config:', error);
      return false;
    });
}

function Config() {
  const form = useForm({
    initialValues: { OPENAI_API_KEY: ''},

    validate: {
      OPENAI_API_KEY: (value) => (value.startsWith("sk-") ? null : "Invalid API Key"),
    },
  });

  const handleSuccess = (values) => {
    console.log(values);
    saveConfig(values.OPENAI_API_KEY);
  }

  const handleFail = (errors) => {
    console.log(errors);
  }

  return (
    <Box maw={320} mx="auto">
      <form onSubmit={form.onSubmit(handleSuccess, handleFail)}>
        <TextInput mt="sm" label="OPENAI API Key" placeholder="OPENAI API Key" {...form.getInputProps('OPENAI_API_KEY')} />
        <Button type="submit" mt="sm">
          Save
        </Button>
      </form>
    </Box>
  );
}

export default Config;
