const createStorage = (provider) => ({
  async get(key, defaultValue) {
    const json = await provider.getItem(key);
    // eslint-disable-next-line no-nested-ternary
    return json === null
      ? typeof defaultValue === 'function'
        ? defaultValue()
        : defaultValue
      : JSON.parse(json);
  },
  async set(key, value) {
    await provider.setItem(key, JSON.stringify(value));
  },
});

export default createStorage;
