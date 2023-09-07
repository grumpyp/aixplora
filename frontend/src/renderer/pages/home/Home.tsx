import Config from '../config/Config';
import Start from '../../components/Start';
import {useState, useEffect} from "react";
import axios from 'axios';

// function checkConfig() {
//     console.log("executed CheckConfig");

//     return axios.get(`${config.REACT_APP_BACKEND_URL}/config`)
//         .then((response) => {
//             const fetchedConfig = response.data;
//             console.log(fetchedConfig);
//             if (fetchedConfig === false) {
//                 // The fetched config is an empty object, return false
//                 return false;
//             }
//             // The fetched config is not an empty object, save it and return true
//             localStorage.setItem('config', JSON.stringify(fetchedConfig));
//             console.log(fetchedConfig);
//             return true;
//         })
//         .catch((error) => {
//             console.log('Error fetching config:', error);
//             // Return false if there's an error
//             return false;
//         });
// }
//     return apiCall('/config', 'GET').then((response) => {
//         const fetchedConfig = response.data;
//         console.log(fetchedConfig);
//         if (fetchedConfig === false) {
//             // The fetched config is an empty object, return false
//             return false;
//         }
//         // The fetched config is not an empty object, save it and return true
//         localStorage.setItem('config', JSON.stringify(fetchedConfig));
//         return true;
//     }
//     )
//     .catch((error) => {
//         console.log('Error fetching config:', error);
//         // Return false if there's an error
//         return false;
//     }
//     );
// }

function Home() {

    const [isConfigValid, setConfigValid] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        // Attempt to retrieve the configuration data from localStorage
        const savedConfig = JSON.parse(localStorage.getItem('config') || '{}');

        if (Object.keys(savedConfig).length > 0) {
            // Configuration data exists in localStorage, set it as valid
            setConfigValid(true);
        } else {
            // Configuration data does not exist in localStorage, set it as invalid
            setConfigValid(false);
        }
    }, []);

    if (isConfigValid === undefined) {
        return <div>Loading...</div>;
    }

    
    return isConfigValid ? <Start /> : <Config setConfigValid={setConfigValid} />;
}

export default Home;