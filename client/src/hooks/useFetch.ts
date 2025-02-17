//@ts-nocheck
import { useEffect, useState } from "react";
import axios from "axios";

const useFetch = (url) => {
    const [data, setData] = useState([]);  
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const res = await axios.get(url);
            //console.log("API Response:", res.data); // Log API response
            setData(res.data);
          } catch (err) {
            console.error("API Error:", err);
            setError(err);
          } finally {
            setLoading(false);
          }
        };
        fetchData();
      }, []);
      

    const reFetch = async () => {
        setLoading(true);
        try {
          const res = await axios.get(url);
          setData(res.data);
        } catch (err) {
          setError(err);
        }
        setLoading(false);
      };
    

    return { data, loading, error, reFetch };
};


export default useFetch;