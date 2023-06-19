import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);

// https://github.com/electron-react-boilerplate/electron-react-boilerplate/issues/3192#issuecomment-1219151506
// window.electron.ipcRenderer.once('ipc-example', (arg) => {
//   console.log(arg);
// });
// window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
