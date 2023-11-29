import config from "../config";
import axios from "axios";
import store from "../store/store";
import { ErrorNotification } from "renderer/components/ErrorNotification";

const selectBaseUrl = () => {
  const isConnected = store.getState().connectedExternalDb.value;
  console.log("isConnected");
    console.log(isConnected);
  if (isConnected === false) {
    return config.REACT_APP_BACKEND_URL;
  } else {
    // TODO: Change this to Cloud URL e.g. cloud.aixplora.app/api
    return 'http://localhost:8000';
    // return 'https://api.aixplora.app/api';
  }
};


export const apiCall = async (endpoint, method, data, disableNotification = false) => {
  try {
    
    const baseUrl = selectBaseUrl();
    console.log(baseUrl);

    const openaiApiKey = store.getState().connectedExternalDb.apiKey;
    const email = store.getState().connectedExternalDb.email;


    console.log(email);
    console.log(openaiApiKey);
    // if (!openaiApiKey || !email) {
    //   throw new Error("API Key or Email is missing from the store");
    // }


    // if apikey and email in store set them global on headewrs
    if (openaiApiKey && email) {
      console.log("hänge apikey und email an header");
      console.log(openaiApiKey);
      axios.defaults.headers.common['apikey'] = openaiApiKey;
      axios.defaults.headers.common['email'] = email;
    }

    const response = await axios({
      method: method,
      url: `${baseUrl}${endpoint}`,
      data: data,
    });

    return response;

  }
  catch (error) {
    if (!disableNotification) {
      ErrorNotification(endpoint, method);
    }
  }
};

