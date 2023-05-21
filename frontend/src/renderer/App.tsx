import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import './App.css';
import Car from './files';
import {HeaderResponsive} from './components/Menu';
import Footer from './components/Footer';
import axios from 'axios';
import Config from './pages/config/Config'
import config from './config.js';



const randomLinks = [
  { link: '/home', label: 'Home' },
  { link: '/files', label: 'Files' },
  { link: '/chat', label: 'Chat' },
  { link: '/config', label: 'Config' },
];

function checkConfig() {
  console.log("executed CheckConfig");

  return axios.get(`${config.REACT_APP_BACKEND_URL}/config`)
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


function Hello() {
  return (
    <div>
      {checkConfig() ? <Config />: <p>Config not loaded</p>}
      <Link to="/files">Blogs</Link>
    </div>
  );
}

export default function App() {
  return (
    <MantineProvider>
      <HeaderResponsive links={randomLinks} />
      <Router>
        <Routes>
          <Route path="/" element={<Hello />} />
          <Route path="files" element={<Car />} />
        </Routes>
      </Router>
      <Footer />
    </MantineProvider>
  );
}
