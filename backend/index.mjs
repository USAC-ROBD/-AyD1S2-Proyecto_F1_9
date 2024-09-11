import app from './server.mjs';

const main = async () => {
    app.listen(app.get('port'), () => {
        console.log(`Server on port ${app.get('port')}`);
    });
};

main();