import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import './App.css';
import Upload from './pages/file-upload/Upload';
import { HeaderResponsive } from './components/Menu';
import Footer from './components/Footer';
import GettingStarted from './components/Start';
import axios from 'axios';
import Config from './pages/config/Config'
import Chat from './pages/Chat/Chat';
import config from './config.js';
import { useState, useEffect } from "react";

const randomLinks = [
  { link: '/', label: 'Home' },
  { link: '/upload', label: 'Files' },
  { link: '/chat', label: 'Chat' },
  { link: '/config', label: 'Config' },
];

function checkConfig() {
  console.log("executed CheckConfig");

  return axios.get(`${config.REACT_APP_BACKEND_URL}/config`)
    .then((response) => {
      const fetchedConfig = response.data;
      console.log(fetchedConfig);
      if (fetchedConfig === false) {
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


export default function Hello() {
  const [isConfigValid, setConfigValid] = useState(null);

  useEffect(() => {
    checkConfig().then((isValid) => {
      setConfigValid(isValid);
    });
  }, []);

  if (isConfigValid === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <MantineProvider>
        <Router>
          <HeaderResponsive links={randomLinks} />
          <Routes>
            <Route path="/" element={isConfigValid ? <GettingStarted /> : <Config />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/config" element={<Config />} />
          </Routes>
          <Footer />
        </Router>
      </MantineProvider>
    </div>
  );
}