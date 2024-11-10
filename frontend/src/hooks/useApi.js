import { useState , useEffect , useContext} from 'react';
import { useLoader } from '../context/LoaderContext';
import axios from 'axios';
import { postDataCustom } from '../utils/common';

const apiUrl = process.env.REACT_APP_API_URL;

const usePostRequest = (apiPath, body , dependencies = []) => {
  const { isLoading, setIsLoading } = useLoader();
  const [isResponseDone , setIsResponseDone]= useState(false)
  const [responseData, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect( () => {
    const postData = async () => {
      setIsLoading(true)
      try {
        const response = await postDataCustom(apiPath , body)
        setData(response.data);
      } catch (err) {
        setError(err.message);
       
        console.log(err)
      } finally {
        setIsResponseDone(true)
        setIsLoading(false)
      }
    }

    postData()

  }, dependencies);

  return { responseData , error , isResponseDone };
};
export default usePostRequest;


export const usePostRequestDynamicUrlFunction = () => {
  // Use this with caution at a time only one of this instance should be called otherwise data will become inconsistent
  const { isLoading, setIsLoading } = useLoader();
  const [error, setError] = useState(null);

  const executePostRequest = async (apiPath, body) => {
    setIsLoading(true);
    try {
      const response = await postDataCustom(apiPath , body)
      return response
    } catch (err) {
      Error(err)
    } finally {
      setIsLoading(false);
    }
  };

  return { executePostRequest };
};