import express, { Response, Request } from "express"
import cors from "cors"
import rootRouter from "./app/routes"

// Initializing Express
const app = express()

// Cors
app.use(cors());

// For getting JSON response
app.use(express.json());

// Landing Route
app.get("/", (req: Request, res:Response) => {
    return res.send("Tasks API Assignment for GoKapture");
  });

  // Routes
app.use("/api", rootRouter);
  
/* Starting Server */
const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
