import app from "./config/init.js";

import connect from "./api/connect/connect.js";

app.use("/connect", connect);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
