var config = {
    url: 'http://localhost:3001',
    debug: false,
    port: 3001,
    mongodb: {
        uri: 'mongodb://localhost/build-launchpad',
        options: {
            autoIndex: false
        },
        session: {
            collection: 'sessions',
            resave: false,
            saveUninitialized: true,
            secret: 'This is a secret'
        }
    },
    hashAlgorithm: 'sha256',
    publicPath: '../public',
    viewsPath: '../views',
    passwordVersion: 0
};

export default config;
