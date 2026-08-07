import express, { type Application, type Request, type Response } from "express";
import {Pool} from "pg";
const app: Application = express();
const port = 8000;


app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));


const pool = new Pool({
    connectionString : "postgresql://neondb_owner:npg_DRA8GXkaKL2o@ep-mute-violet-ay5ldhrm-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
});

const initDb = async () => {
    try{
        await pool.query()
    } catch (error) {
        console.error(error); 
    }

};

app.get('/', (req: Request, res: Response) => {
    //   res.send('Hello World!');
    res.status(200).json({
        message: "Express Server",
        "author": "sabit",
    });
});

app.post('/', async (req: Request , res: Response)=>{
    // console.log(req.body);
    // const body = req.body;
    const {name,email,password} = req.body;
    res.status(201).json({
        message: "created",
        data: {
            name,
            email
        },
    });
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
