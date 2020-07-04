require("dotenv").config();
const express = require("express");
const app = express();
const { PORT } = require("./config/constants");
const corsMiddleWare = require("cors");
const loggerMiddleWare = require("morgan");
const authMiddleWare = require("./auth/middleware");
const authRouter = require("./routers/auth.js");
const postsRouter = require("./routers/posts.js");
const postRouter = require("./routers/post.js");

app.use(
  corsMiddleWare({
    credentials: true,
  })
);
app.use(loggerMiddleWare("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

if (process.env.DELAY) {
  app.use((req, res, next) => {
    setTimeout(() => next(), parseInt(process.env.DELAY));
  });
}
// Routes
app.get("/", (req, res) => {
  res.send("Hi from express");
});

app.use("/", authRouter);
app.use("/posts", postsRouter);
app.use("/post", postRouter);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
