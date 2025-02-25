const config = {
    development: {
      apiUrl: 'http://localhost:3000',
    },
    production: {
    apiUrl: 'https://192.168.40.250:3000',
  },
};
const apiUrl = config[process.env.NODE_ENV].apiUrl;
export  { apiUrl };
