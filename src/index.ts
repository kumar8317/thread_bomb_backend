import express, {
  ErrorRequestHandler,
  Express,
  NextFunction,
  Request,
  Response,
} from "express";
import cors from "cors";
import { PORT } from "./secrets";
import rootRouter from "./routes";
import { PrismaClient } from "@prisma/client";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use("/api", rootRouter);

export const prismaClient = new PrismaClient({
  log: ["query"],
});

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  const error = {
    status: 404,
    message: "Api endpoint not found",
  };
  next(error);
});

const errorHanlder: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  const data = err.data || null;
  res.status(status).json({
    type: "error",
    message,
    data,
  });
};
// global error handling middleware
app.use(errorHanlder);
app.listen(PORT, () => {
  console.log(`App working!`);
});
