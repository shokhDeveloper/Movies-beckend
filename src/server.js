const express = require("express");
const cors = require("cors");
const { PORT } = require("./config");
const { authRouter } = require("./router/authRouter");
const { model } = require("./middleware/model");
const { toCheck } = require("./middleware/toCheckUser");
const { dataRouter } = require("./router/dataRouter");
const { updateRouter } = require("./router/updateUser");
const {userRouter}  = require("./router/userRouter");
const pagination = require("./middleware/pagination");
const { adminRouter } = require("./router/adminRouter");

const app = express();

app.use(cors());

app.use(express.json());
app.use(model);
app.use(toCheck);
app.use(pagination);

app.use("/auth", authRouter);

// authToken

app.use("/data?", dataRouter);
app.use("/users?", userRouter);
app.use("/update", updateRouter);
app.use("/admin", adminRouter)

app.listen(PORT, () => {
  console.log(`Server is running http://localhost:${PORT}`);
});

// 060421admin@

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwidXNlckFnZW50IjoiUG9zdG1hblJ1bnRpbWUvNy4zNy4zIiwiaWF0IjoxNzEzNDI5MTM0LCJleHAiOjE3MTM1MTU1MzR9.DijzvDioqxdGfxWLnSgtHMI-lSXlMPZNd8MevgWeMYY