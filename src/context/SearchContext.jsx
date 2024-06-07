import React, {createContext, useContext, useState} from 'react';

// components
import {API_STATUS} from '../utils/Constants';
import axiosInstance from '../axios/AxiosInstance';
import {gettingData} from '../utils/EncDec';

const SearchContext = createContext();

const SearchContextProvider = ({children}) => {
  // state for store password that i am getting from passwordList(context)
  const [searchPasswords, setSearchPasswords] = useState({
    status: API_STATUS.IDLE,
    searching: false,
    data: [],
  });

  // custom debouce for delay function invocation
  const customDebouce = (cb, timeout) => {
    let timer;

    return (...args) => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        cb(args);
      }, timeout);
    };
  };

  // here i am calling customDebouce function and passing callBack function(where logic is written for search) and timeout(for delay)
  const onSearch = customDebouce(async value => {
    // return console.log('search', value);
    const [query, category] = value;
    // const query = e[0];

    if (!query) {
      setSearchPasswords({status: API_STATUS.IDLE, searching: false, data: []});
      return;
    }

    setSearchPasswords(prev => ({
      ...prev,
      searching: true,
      status: API_STATUS.LOADING,
    }));

    try {
      const res = await axiosInstance.get(
        `/password/search?category=${category}&search=${query}`,
      );

      const newPasswordData = await gettingData(res.data);
      setSearchPasswords(prev => ({
        ...prev,
        status: API_STATUS.SUCCESS,
        data: newPasswordData,
      }));
    } catch (err) {
      console.log(err?.response?.data?.error || err?.message);
      setSearchPasswords(prev => ({
        ...prev,
        status: API_STATUS.FAILED,
      }));
    }
  }, 600);

  const deleteSearchResult = id => {
    // if user search any vault/password and then delete any vault/password then i also have to delete data from search result that is stored in searchPasswords state.

    setSearchPasswords(prev => ({
      ...prev,
      data: prev.data.filter(item => item._id !== id),
    }));
  };

  const editSearchResult = value => {
    // if user search any vault/password and then edit any vault/password then i also have to edit data from search result that is stored in searchPasswords state.

    setSearchPasswords(prev => ({
      ...prev,
      data: prev.data.map(item => (item._id === value._id ? value : item)),
    }));
  };

  return (
    <SearchContext.Provider
      value={{
        searchPasswords,
        setSearchPasswords,
        onSearch,
        deleteSearchResult,
        editSearchResult,
      }}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContextProvider;

export const useSearchContext = () => useContext(SearchContext);
