import { loadEnvFile } from 'node:process';
loadEnvFile("./config/.env");

import app from "./src/app.js";

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});