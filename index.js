import express from "express";
 import cors from 'cors'
import { registerUser } from "./authRoute/signup.js";
 import { loginUser } from "./authRoute/login.js";
import { submitTask } from "./Task/task.js";
import { getData } from "./authRoute/getData.js";
import { editTask } from "./authRoute/editTask.js";
import { getTaskById } from "./Task/getTaskById.js";
import { updateUser } from "./profile/editUser.js";
import { getUserById } from "./profile/getUser.js";
import { getAllTask } from "./Admin/getAllTask.js";
import { getAllUser } from "./Admin/getAllUser.js";
import { registerAdmin } from "./Admin/storeAdmin.js";
import http from 'http';
import { Server } from 'socket.io';
import cron from 'node-cron'
import { logoutUser } from "./authRoute/logout.js";
  
   
const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());


const server = http.createServer(app);
const io = new Server(server);


app.post("/register",registerUser);
app.post("/login",loginUser);
app.post("/task",submitTask);
app.get("/getData/:id",getData);
app.put("/editTask/:id",editTask);
app.get("/getById/:id", getTaskById);
app.put("/edituser/:id",updateUser);
app.get("/getUserById/:id",getUserById);

app.get("/admin/getAllTask",getAllTask);
app.get("/admin/getAllUser",getAllUser);
app.get("/admin/register",registerAdmin)
app.post("/logout",logoutUser);

//when user connects
io.on('connection',(socket) =>{
   console.log("New client connected :", socket.id);
})


io.on('connection', (socket) => {
     socket.on('register', (userId) => {
      db.query('UPDATE users SET socket_id = ? WHERE id = ?', [socket.id, userId], (err) => {
        if (err) {
          console.error('Error storing socket_id:', err);
        }
      });
    });
    });

  

//Trigger Daily Remainder at 5:30 PM
cron.schedule('45 11 * * *',() =>{
    //Query pending updates from your mysqll database
    db.query('SELECT * FROM daily_updates WHERE status = "Pending',(err,updates) =>{
        if(err){
            console.error("Error Fetching pending updates", err);
            return;
        }

        const userSocketId = result[0]?.socket.id;
        if(userSocketId){
            io.to(userSocketId).emit('notification',{
                title:"Pending Updates",
                message: 'You have pending updates. Please check your tasks!',
            })
        }
    })
})


app.listen(PORT,() =>{
    console.log(`Application is working on ${PORT}`)
})
