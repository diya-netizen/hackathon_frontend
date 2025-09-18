const config = {
    local:{
        apiUrl: 'http://localhost:3001',
        portalUrl: 'http://localhost:3000'
    }
};

const environment = process.env.APP_ENV || 'local';

export default config[environment as "local"];
