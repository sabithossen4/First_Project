import express, { type Application, type Request, type Response } from "express";
import {Pool} from "pg";
const app: Application = express();
const port = 8000;


app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));


const pool = new Pool({
    connectionString : "postgresql://neondb_owner:npg_DRA8GXkaKL2o@ep-mute-violet-ay5ldhrm-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
});


const initDb = async () => {
    try{
        await pool.query(`
            CREATE TABLE if NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(20) NOT NULL,
                email VARCHAR(20) UNIQUE NOT NULL,
                password VARCHAR(20) NOT NULL,
                is_active BOOLEAN DEFAULT true,
                age INT,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);
        console.log("Database connected successfully");
    } catch (error) {
        console.error(error); 
    }
};

initDb();


app.get('/', (req: Request, res: Response) => {
    //   res.send('Hello World!');
    res.status(200).json({
        message: "Express Server",
        "author": "sabit",
    });
});


app.post('/api/users', async (req: Request , res: Response)=>{
    // console.log(req.body);
    // const body = req.body;
    const {name,email,password,age} = req.body;

    try {
           const result = await pool.query(`
        INSERT INTO users (name, email, password, age)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `, [name, email, password, age]);

    // console.log(result);

    res.status(201).json({
        success: true,
        message: "user created successfully",
        data: result.rows[0],
    });
    } catch (error : any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        });
    }
});


app.get('/api/users', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.status(200).json({
            success: true,
            message: "users retrieved successfully",
            data: result.rows,
        });
    } catch (error : any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        });
    }
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
