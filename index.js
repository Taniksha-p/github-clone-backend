const express = require("express");
const cors = require("cors");
const dotenv  = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const mainRouter = require("./routes/main.router");


const yargs = require('yargs');
const { hideBin } = require("yargs/helpers");

const {initRepo} = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pushRepo } = require("./controllers/push");
const { pullRepo } = require("./controllers/pull");
const { revertRepo } = require("./controllers/revert");

require('dotenv').config();  

yargs(hideBin(process.argv))
.command("start" , "Starts a new server" , {} , startServer)
.command('init' , "Initialise a new repository" , {} , initRepo)
.command('add <file>' , "Add a file to the repository" , (yargs) => {yargs.positional("file" , {
    describe: "File to add to the staging area" , 
    type : "string",
})

} ,
(argv) => {
    addRepo(argv.file);
})
.command('commit <message>' , "Commit the staged files" , (yargs) => {yargs.positional("message" , {
    describe: "Commit message" , 
    type : "string",
})} ,
(argv) => {
    commitRepo(argv.message);
} 

)
.command('push' , "Push commits to S3" , {} , pushRepo)
.command('pull' , "Pull commits to S3" , {} , pullRepo)
.command('revert <commitID>' , "Revert to a specific commit" , 
    (yargs) => {yargs.positional("commitID" , {
    describe: "Comit ID to revert to" , 
    type : "string",
});
} , (argv) => {
   revertRepo(argv.commitID);
} )
.demandCommand(1,"You need at least one command")
.help().argv;

function startServer() {
   const app = express();
   const PORT = process.env.PORT || 3000;

   app.use(bodyParser.json());
   app.use(express.json());

   const MONGOURI = process.env.MONGODB_URI;

   mongoose.connect(MONGOURI)
   .then(() => console.log("MongoDB connected!"))
   .catch((err) => console.error("error : " , err));

   app.use(cors({ origin : "*"}));

   app.use("/" , mainRouter);

   app.get("/" , (req,res) => {
    res.send("Welcome!");
   });

   let user = "test";
   const httpServer = http.createServer(app);
   const io = new Server(httpServer , {
    cors : {
        origin : "*",
        methods : ["GET" , "POST"] ,
    },
   });

   io.on("connection" , (socket) => {
    socket.on("joinRoom" , (userID) => {
        user = userID;
        console.log("=====");
        console.log(user);
        console.log("=====");
        socket.join(userID);
    });
   });

   const db = mongoose.connection;

   db.once("open" , async () => {
    console.log("CRUD operations called");
    //CRUD OPERATIONS

   });

   httpServer.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`);
   })
}