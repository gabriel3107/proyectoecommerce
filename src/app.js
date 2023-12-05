import express from "express";
import handlebars from 'express-handlebars'
import { __dirname } from './utils.js';
import { Server } from "socket.io";
import viewsRouter from "./routes/viewrouter.js";
import productsRouter from './routes/ProductManager.router.js';
import cartsRouter from "./routes/cars.router.js";
import { Server } from "socket.io";
import mongoose from "mongoose";
import ChatManager from "./dao/dbManager/chat.manager.js";
const chatManager= new ChatManager();
import ProductManager from "./dao/dbManager/products.manager.js";
import sessionsRouter from './routes/sessions.router.js';
import MongoStore from 'connect-mongo';
import session from 'express-session';
const productManager= new ProductManager();
import {initializePassport} from "./config/passport.config.js"
import passport from "passport";

const app = express ();

try{
    await mongoose.connect("mongodb+srv://gabrielescarate33:Xo9mD8WITwByoebt@cluster55575ge.cox6brd.mongodb.net/segundaentregamongo?retryWrites=true&w=majority");
    console.log("Connected to DB");
}
catch(error){console.log(error.message)};

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.engine("handlebars",handlebars.engine());

app.set('views', `${__dirname}/views`); 
app.set("view engine", "handlebars"); 
app.use(express.static(`${__dirname}/public`));    

app.use(session({ 
    store: MongoStore.create({
        client: mongoose.connection.getClient(), 
        ttl: 3600
    }),
    secret: 'Coder5575Secret',
    resave: true, 
    saveUninitialized: true, 
   
}));


initializePassport();
app.use(passport.initialize());
app.use(passport.session());


app.use("/", viewsRouter);
app.use("/api/products",productsRouter);
app.use("/api/carts",cartsRouter);
app.use('/api/sessions', sessionsRouter);
app.use((req, res) => {
    res.status(404).send('Error 404: Page Not Found');
  });

const server= app.listen(8080, ()=>console.log("Server running"));

const io = new Server(server);
app.set("socketio",io);



io.on("connection",async(socket) =>{
    const messages = await chatManager.getAll();
    console.log("Nuevo cliente conectado");

    socket.on("authenticated",data=>{
    socket.emit("messageLogs",messages); 
    socket.broadcast.emit("newUserConnected",data);
});

    socket.on("message",async(data)=>{
   
    await chatManager.save(data);
    const newMessage = await chatManager.getAll();
    io.emit("messageLogs",newMessage) 
})

})