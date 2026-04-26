const PREFIX = 'epep_';
const memStorage = new Map();

export const storage = {
  get: (key, def = null) => {
    try {
      const val = localStorage.getItem(PREFIX + key);
      return val ? JSON.parse(val) : def;
    } catch { return memStorage.get(key) || def; }
  },
  set: (key, val) => {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(val));
    } catch { memStorage.set(key, val); }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch { memStorage.delete(key); }
  },
  clear: () => {
    try {
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith(PREFIX)) localStorage.removeItem(k);
      });
    } catch { memStorage.clear(); }
  }
};