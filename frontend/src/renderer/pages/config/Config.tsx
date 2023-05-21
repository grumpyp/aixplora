import { useForm } from '@mantine/form';
import { TextInput, Button, Box } from '@mantine/core';
import axios from 'axios';
import config from '../../config.js';


function saveConfig(OPENAI_API_KEY) {
  const payload = {
    apiKey: OPENAI_API_KEY
  };

  return axios.post('http://localhost:8000/config/', payload)
    .then((response) => {
      const fetchedConfig = response.data;

      if (Object.keys(fetchedConfig).length === 0) {
        // The fetched config is an empty object, return false
        return false;
      }

      // The fetched config is not an empty object, save it and return true
      localStorage.setItem('config', JSON.stringify(fetchedConfig));
      console.log(fetchedConfig);
      return true;
    })
    .catch((error) => {
      console.log('Error fetching config:', error);
      // Return false if there's an error
      return false;
    });
}


function Config() {
  const form = useForm({
    initialValues: { OPENAI_API_KEY: ''},

    // functions will be used to validate values at corresponding key
    validate: {
      OPENAI_API_KEY: (value) => (value.startsWith("sk-") ? null : "Invalid API Key"),
    },
  });

  return (
    <Box maw={320} mx="auto">
      <form onSubmit={form.onSubmit(console.log)}>
        <TextInput mt="sm" label="OPENAI API Key" placeholder="OPENAI API Key" {...form.getInputProps('OPENAI_API_KEY')} />
        <Button type="submit" mt="sm" onSubmit={saveConfig(form.getInputProps('OPENAI_API_KEY').value)}>
          Save
        </Button>
      </form>
    </Box>
  );
}

export default Config;
