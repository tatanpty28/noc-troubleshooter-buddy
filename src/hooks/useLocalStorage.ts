import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

// Hook for managing multiple localStorage keys with a common prefix
export function useLocalStorageManager(prefix: string = 'noc_app') {
  const getItem = <T>(key: string, defaultValue: T): T => {
    try {
      const item = window.localStorage.getItem(`${prefix}_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${prefix}_${key}":`, error);
      return defaultValue;
    }
  };

  const setItem = <T>(key: string, value: T): void => {
    try {
      window.localStorage.setItem(`${prefix}_${key}`, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${prefix}_${key}":`, error);
    }
  };

  const removeItem = (key: string): void => {
    try {
      window.localStorage.removeItem(`${prefix}_${key}`);
    } catch (error) {
      console.error(`Error removing localStorage key "${prefix}_${key}":`, error);
    }
  };

  const getAllKeys = (): string[] => {
    try {
      return Object.keys(window.localStorage)
        .filter(key => key.startsWith(`${prefix}_`))
        .map(key => key.replace(`${prefix}_`, ''));
    } catch (error) {
      console.error(`Error getting localStorage keys with prefix "${prefix}":`, error);
      return [];
    }
  };

  return { getItem, setItem, removeItem, getAllKeys };
}