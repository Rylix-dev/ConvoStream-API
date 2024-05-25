import app from "./config/init.js";

import connect from "./api/connect/connect.js";
import user from "./api/user/main.js"

app.use("/connect", connect);
app.use("/user", user)

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
