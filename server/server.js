import { app } from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { envConfig } from "./src/config/config.js";

connectDB();

const PORT = envConfig.PORT;

app.listen(PORT, () => {
    console.log(`hello server ${PORT}`)
})