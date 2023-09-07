import {MemoryRouter as Router, Routes, Route} from 'react-router-dom';
import {MantineProvider} from '@mantine/core';
import './App.css';
import Upload from './pages/file-upload/Upload';
import {HeaderResponsive} from './components/Menu';
import Footer from './components/Footer';
import Home from './pages/home/Home';
import Config from './pages/config/Config';
import Chat from './pages/Chat/Chat';
import {useState, useEffect} from "react";
import {Summary} from './pages/summary/Summary';
import store from './store/store';
import {Provider} from 'react-redux';
import {Notifications} from '@mantine/notifications';

const randomLinks = [
    {link: '/', label: 'Home'},
    {link: '/upload', label: 'Files'},
    {link: '/chat', label: 'Chat'},
    {link: '/config', label: 'Config'},
    {link: '/summary', label: 'Summary'},

];

export default function Hello() {
   
  const [colorScheme, setColorScheme] = useState<any>('light');
  // placeholder for props Config setConfigValid={setConfigValid}
  // this prop is used in Home component to get the config status from Config component
  const [isConfigValid, setConfigValid] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    window.addEventListener('beforeunload', () => {
      localStorage.clear();
    });
  }, []);

  const toggleTheme = () => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  };

    return (
        <div>
            <Provider store={store}>
                <MantineProvider theme={{colorScheme}} withGlobalStyles withNormalizeCSS>
                    <Notifications />
                    <Router>
                        <HeaderResponsive links={randomLinks}/>
                        <Routes>
                            <Route path="/" element={<Home />}/>
                            <Route path="/upload" element={<Upload/>}/>
                            <Route path="/chat" element={<Chat/>}/>
                            <Route path="/config" element={<Config setConfigValid={setConfigValid}/>}/>
                            <Route path="/summary" element={<Summary/>}/>

                        </Routes>
                        <Footer toggleTheme={toggleTheme} colorScheme={colorScheme}/>
                    </Router>
                </MantineProvider>
            </Provider>
        </div>
    );
}