
import 'dotenv/config'


import { app } from './src/app.js';
import connectDB from './src/db/index.js';

connectDB().then(()=>{
    app.listen(process.env.PORT||8000,"0.0.0.0",()=>{
        console.log(`server is running at port: ${process.env.PORT}`);
    })
}).catch((err)=>{
    console.log("Mongo DB error", err);
})