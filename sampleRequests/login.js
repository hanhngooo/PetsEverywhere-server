const axios = require("axios");
const { PORT } = require("../config/constants");

async function loginExample() {
  try {
    const response = await axios.post(`http://localhost:${PORT}/login`, {
      email: "hanhngo@gmail.com",
      password: "hanhngo123",
    });
    console.log("RESPONSE FROM SERVER", response.data);
  } catch (error) {
    console.log("OH NO AN ERROR", error.message);
    console.log("WHAT HAPPENED?", error.response.data);
  }
}

loginExample();
