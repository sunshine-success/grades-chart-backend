import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { gradesRouter } from "./routes/gradesRoutes";
import { NextFunction, Request, Response } from "express";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/grades", gradesRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
