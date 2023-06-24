import config from "../config";
import axios from "axios";
import store from "../store/store";

const selectBaseUrl = () => {
  const isConnected = store.getState().connectedExternalDb.value;
  console.log("isConnected");
    console.log(isConnected);
  if (isConnected === false) {
    return config.REACT_APP_BACKEND_URL;
  } else {
    return 'http://109.22.30.2';
  }
};

export const apiCall = async (endpoint, method, data) => {
  const baseUrl = selectBaseUrl();
  console.log("state baseUrl");
  console.log(baseUrl);
  const response = await axios({
    method: method,
    url: `${baseUrl}${endpoint}`,
    data: data
  });

  return response;
};
