import React, { createContext, useContext, useState } from 'react';

// components
import { API_STATUS } from '../utils/Constants';
import axiosInstance from '@/api/axiosInstance';
import { gettingData } from '../utils/EncDec';

const SearchContext = createContext();

export const initialState = {
  status: API_STATUS.IDLE,
  searching: false,
  data: { vault: [] },
};

const SearchContextProvider = ({ children }) => {
  // state for store password that i am getting from passwordList(context)
  const [searchPasswords, setSearchPasswords] = useState(initialState);

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
    const [query, category] = value;

    if (!query) {
      setSearchPasswords(initialState);
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

      const { next, password } = res.data;
      const newPasswordData = await gettingData(password);
      setSearchPasswords(prev => ({
        ...prev,
        status: API_STATUS.SUCCESS,
        data: { next, vault: newPasswordData },
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
      data: {
        ...prev.data,
        vault: prev.data.vault.filter(item => item._id !== id),
      },
    }));
  };

  const editSearchResult = value => {
    // if user search any vault/password and then edit any vault/password then i also have to edit data from search result that is stored in searchPasswords state.

    setSearchPasswords(prev => ({
      ...prev,
      data: {
        ...prev.data,
        vault: prev.data.vault.map(item =>
          item._id === value._id ? value : item,
        ),
      },
    }));
  };

  const fetchMoreSearchData = async nextURL => {
    try {
      const res = await axiosInstance.get(nextURL);

      const { next, password } = res.data;
      const newPasswordData = await gettingData(password);
      setSearchPasswords(prev => ({
        ...prev,
        data: { next, vault: [...prev.data.vault, ...newPasswordData] },
      }));
    } catch (err) {
      console.log(err?.response?.data?.error || err?.message);
      setSearchPasswords(prev => ({
        ...prev,
        status: API_STATUS.FAILED,
      }));
    }
  };

  return (
    <SearchContext.Provider
      value={{
        searchPasswords,
        setSearchPasswords,
        onSearch,
        deleteSearchResult,
        editSearchResult,
        fetchMoreSearchData,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContextProvider;

export const useSearchContext = () => useContext(SearchContext);
