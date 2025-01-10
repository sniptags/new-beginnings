
const path = require('path');

module.exports = {
  // ...existing code...
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      // ...other fallbacks if needed...
    },
  },
  // ...existing code...
};