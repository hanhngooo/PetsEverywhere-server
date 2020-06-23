const express = require("express");
const app = express();
const { PORT } = require("./config/constants");
const corsMiddleWare = require("cors");
app.use(
  corsMiddleWare({
    credentials: true,
  })
);
/**
 * Middlewares
 */

/**
 * morgan:
 *
 * simple logging middleware so you can see
 * what happened to your request
 *
 * example:
 *
 * METHOD   PATH        STATUS  RESPONSE_TIME   - Content-Length
 *
 * GET      /           200     1.807 ms        - 15
 * POST     /echo       200     10.251 ms       - 26
 * POST     /puppies    404     1.027 ms        - 147
 *
 * github: https://github.com/expressjs/morgan
 *
 */

const loggerMiddleWare = require("morgan");
app.use(loggerMiddleWare("dev"));

/**
 *
 * express.json():
 * be able to read request bodies of JSON requests
 * a.k.a. body-parser
 * Needed to be able to POST / PUT / PATCH
 *
 * docs: https://expressjs.com/en/api.html#express.json
 *
 */

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

/**
 *
 * authMiddleware:
 *
 * When a token is provided:
 * decrypts a jsonwebtoken to find a userId
 * queries the database to find the user with that add id
 * adds it to the request object
 * user can be accessed as req.user when handling a request
 * req.user is a sequelize User model instance
 *
 * When no or an invalid token is provided:
 * returns a 4xx reponse with an error message
 *
 * check: auth/middleware.js
 * for a demo check the following endpoints
 *
 * POST /authorized_post_request
 * GET /me
 *
 */

const authMiddleWare = require("./auth/middleware");

/**
 *
 * cors middleware:
 *
 * Since our api is hosted on a different domain than our client
 * we are doing "Cross Origin Resource Sharing" (cors)
 * Cross origin resource sharing is disabled by express by default
 * for safety reasons (should everybody be able to use your api, I don't think so!)
 *
 * We are configuring cors to accept all incoming requests
 * If you want to limit this, you can look into "white listing" only certain domains
 *
 * docs: https://expressjs.com/en/resources/middleware/cors.html
 *
 */

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

const authRouter = require("./routers/auth.js");

app.use("/", authRouter);

const postsRouter = require("./routers/posts.js");
app.use("/posts", postsRouter);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
