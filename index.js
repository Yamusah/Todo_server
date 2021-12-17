import express, { request, response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import TodoModel from "./schema/todo_schema.js";

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config()


const port = 3000;

const db = process.env.DB_URL;
const username = process.env.USER_NAME;
const password = process.env.USER_PASSWORD;



// connect to local DB
// mongoose
//   .connct("mongodb: //localhost/todo_db", {
//     useNewUrlParser: true
//     useUnifiedTopology: true,
//}) // .then(() =>{
 //     console.log("Connected to MongoDB");
//  })
//   .catch((err)=> {
//     console.log(err);    
//});


mongoose
.connect(db,{
    useNewurlParser: true,
    useUnifiedTopology: true,
})
.then(()=> {
    console.log("Connected to MongoDB");
})

.catch((err) => {
    console.log(err);
});


///get all todos


app.get("/todos", async(request,response) => {
    const todoModel = await TodoModel.find({});
    if (todoModel) {
        return response.status(200).json({
            status: true,
            messsage: "Todos fetched successfully",
            data: todoModel
        });  
     }else {
         return response.status(400).json({
             status: false,
             messsage: "Todos not found",
         });
     }
});



/// get one todo (:Id)


app.get("/todos/:id", async(request,response) => {
    const{status} = request.params;

    const todoModel = await TodoModel.find({}).where('status').equals(status);
    if (todoModel) {
        return response.status(200).json({
            status: true,
            messsage: "Todos fetched successfully",
            data: todoModel
        });  
     }else {
         return response.status(400).json({
             status: false,
             messsage: "Todos not found",
         });
     }
});


//create a todo
//create new



app.post("/todo", async(request,response) => {
    const {tittle,description,date_time} = request.body;

    const todoModel = await TodoModel.create({
        tittle,
        description,
        date_time,
    });


    if (todoModel) {
        return response.status(201).json({
            status: true,
            message: "Todos create",
            date: todoModel,
        });
    }else {
        return response.status(400).json({
            status: false,
            message: "todos failed to create",
        })
    }

});

app.patch("/todos/:id",async(request,response) =>{
    const { id } = request.params;
    const { status } = request.body

const todoModel = await TodoModel.updateOne({status: status}).where({
    _id: id
});

if (todoModel) {
    return response.status(200).json({
        status: true,
        message: "Todos marked as completed!",
        data: todoModel,
    });
}else {
    return response.status(400).json({
        status: false,
        message : "Todos failed to update",
    });
}
});

///delete a todo
app.delete("/todos/:id", async(request,response) => {
    const todoModel = await TodoModel.findByIdAndDelete(request.params.id);

    if(todoModel) {
        return response.status(200).json({
            status: true,
            message: "Todo deleted",
            data: todoModel,
        });
    }else {
        return response.status(400).json({
            status : false,
            message: "Todos failed to delete",
        });
    }
});

app.listen(port, () => console.log('Hey! Welcome to our page ${port}!'));