const modules = [
  {
    name: 'wi-control',
    entry: './src/wi-control/module',
    root: 'wi-control-container',
    generate: true
  }
];

const entries = modules.reduce(
  (obj, item) => ({
    ...obj,
    [item.name]: item.entry
  }),
  {}
);

module.exports = {
  modules,
  entries
};
