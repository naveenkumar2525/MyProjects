import { useState } from "react";

const getLocalStorageValue = (key: string) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : undefined;
};

const setLocalStorageValue = (key: string, value: any) => {
  const valueStr = JSON.stringify(value);
  localStorage.setItem(key, valueStr);
};

export const useLocalStorage = (key: string, defaultValue: string) => {
  const [value, setValue] = useState(getLocalStorageValue(key) ?? defaultValue);

  const onChange = (value: any) => {
    setLocalStorageValue(key, value);
    setValue(value);
  };

  return [value, onChange];
};
