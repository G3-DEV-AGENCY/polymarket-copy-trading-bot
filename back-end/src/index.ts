
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "dotenv/config";
import userRoutes from "./routes/user";
import coinRoutes from "./routes/coin";
import messageRoutes from "./routes/feedback";
import coinTradeRoutes from "./routes/coinTradeRoutes";
import chartRoutes from "./routes/chart";
import { init } from "./db/dbConncetion";
import { io, socketio } from "./sockets";
import { AgentsLandListener } from "./logListeners/AgentsLandListener";
import { Connection } from "@solana/web3.js";
import {
//   commitmentLevel,
//   endpoint,
  listenerForEvents,
//   wsEndpoint,
} from "./program/web3";
import CurveConfig from './models/CurveConfig';
import curveRoutes from './routes/curveRoutes';
import { PROGRAM_ID } from "./program/programId";

const app = express();
const port = process.env.PORT || 5000;

const whitelist = ["http://localhost:3000"];

const corsOptions = {
  origin: "*",
  credentials: false,
  sameSite: "none",
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

init();

app.get("/", async (req, res) => {
  res.json("Success!!");
});

app.use('/user/', userRoutes);
app.use('/coin/', coinRoutes);
app.use('/feedback/', messageRoutes);
app.use('/cointrade/', coinTradeRoutes);
app.use('/chart/', chartRoutes);
app.use('/curveConfig/', curveRoutes)

export const server = app.listen(port, async () => {
  console.log(`server is listening on ${port}`);
  listenerForEvents();
  // const connection = new Connection(endpoint!, {
  //   commitment: commitmentLevel,
  //   wsEndpoint,
  // });
  // const agentLandListenr = new AgentsLandListener(connection);
  // agentLandListenr.listenProgramEvents(PROGRAM_ID.toString());
  // return;
});
socketio(server);