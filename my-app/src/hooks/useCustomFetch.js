import React, {useState,useEffect} from 'react'
import AxiosInstance from "../utils/axios";
import Axios from "axios";

const useHttpPOST = (path,body) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    setError(false);
    setLoading(true);
    const source = Axios.CancelToken.source();
    
    (async () => {
      try{
        const response = await AxiosInstance.post(path, body)
        const data = response?.data;
        if(data) setData(data);
        setLoading(false);
      }
      catch(err){
        console.log(err)
        setError(true);
        setLoading(false);
      }
    })()

    return () => {
      source.cancel(
        "Canceled because of component unmounted"
      );
    };
  }, [body])


  return { data, loading, error }
} 

export default useHttpPOST;