import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export async function postDataCustom( apiPath, body) {
    try {
      const token = localStorage.getItem('authToken');
      const headers = {
        'Content-Type': 'application/json',
        'authToken': `${token}`,
      };
  
      const response = await axios.post(`${apiUrl}${apiPath}`, body, { headers });
      return response;
    } catch (err) {
      console.error(err);
      throw new Error(err.message); // or you can return null, depending on your preference
    }
  }
  