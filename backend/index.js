const express = require("express");
const http = require('http');

const app = express();
const server = http.createServer(app);

const { initSocket } = require('./config/socket');

const io = initSocket(server);

const dotenv =  require("dotenv");
dotenv.config();

const cors = require("cors");
app.use(cors());

const morgan = require("morgan");
app.use(morgan("dev"));

app.use(express.json());

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack || err.message);

  res.status(500).json({
    success: false,
    message: 'Something went wrong. Please try again later.',
  });
});

app.use((req, res, next) => {
  req.io = io;
  next();
});


app.get("/test",(req,res)=>{
    res.send("Hello world");
});

const memes = require("./routes/memes");
app.use("/memes", memes)

const leaderboard = require('./routes/leaderboard');
app.use('/leaderboard', leaderboard);

const port = 3000;
server.listen(port, ()=>{
    console.log("server is running on port ", port);
})