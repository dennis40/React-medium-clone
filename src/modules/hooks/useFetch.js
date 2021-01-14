import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useLocalStorage } from './useLocalStorage';

export const useFetch = (url) => {
  const baseUrl = 'https://conduit.productionready.io/api/';
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState({});
  const [token] = useLocalStorage('token');

  const doFetch = useCallback((options = {}) => {
    setOptions(options);
    setIsLoading(true);
  }, []);

  useEffect(() => {
    let skipGetResponseAfterDestroy = false;
    const requestOptions = {
      ...options,
      ...{
        headers: {
          authorization: token ? `Token ${token}` : '',
        },
      },
    };
    if (!isLoading) {
      return;
    }
    axios(baseUrl + url, requestOptions)
      .then((response) => {
        if (!skipGetResponseAfterDestroy) {
          setResponse(response.data);
        }
      })
      .catch((error) => {
        if (!skipGetResponseAfterDestroy) {
          setError(error.response.data);
        }
      })
      .finally(() => {
        if (!skipGetResponseAfterDestroy) {
          setIsLoading(false);
        }
      });
    return () => {
      skipGetResponseAfterDestroy = true;
    };
  }, [isLoading, url, options, token]);

  return [{ isLoading, response, error }, doFetch];
};
