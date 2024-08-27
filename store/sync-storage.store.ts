import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};
console.log(typeof window !== 'undefined', 'typteof window')

const storage = typeof window !== 'undefined' ? createWebStorage('ccfl') : createNoopStorage();

export default storage;
