const express = require("express");

const app = express();
const dotenv =  require("dotenv");
dotenv.config();

app.use(express.json());

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack || err.message);

  res.status(500).json({
    success: false,
    message: 'Something went wrong. Please try again later.',
  });
});


app.get("/test",(req,res)=>{
    res.send("Hello world");
});

const memes = require("./routes/memes");
app.use("/memes", memes)

const port = 3000;
app.listen(port, ()=>{
    console.log("server is running on port ", port);
})