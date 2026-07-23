import { connectDB } from "./config/db.js";
import app from "./app.js";
import { envVariables } from "./config/env.js";

const ENVIRONMENT = envVariables.nodeEnv;
const PORT = envVariables.port;

await connectDB();
app.listen(PORT, () => {
  console.log(
    `Environmet : ${ENVIRONMENT} , the app is listening on port : ${PORT}`,
  );
});
