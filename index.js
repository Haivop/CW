const node_process = require('node:process');
node_process.loadEnvFile("./config/.env");

const app = require("./src/app") ;

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});