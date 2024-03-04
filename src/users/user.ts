import bodyParser from "body-parser";
import express from "express";
import { BASE_USER_PORT } from "../config";

export type SendMessageBody = {
  message: string;
  destinationUserId: number;
};

export async function user(userId: number) {
  const _user = express();
  _user.use(express.json());
  _user.use(bodyParser.json());

  let LRMessage: string | null = null;
  let LSMessage: string | null = null;

  // TODO implement the status route
  _user.get("/status", (req, res) => {
    res.send('live')
  });
  
  _user.get("/getLastReceivedMessage", (req, res) =>{
    LRMessage = req.query.message as string;
    res.json({
      result: LRMessage
    })
  })

  _user.get("/getLastSentMessage", (req, res) =>{
    LSMessage = req.query.message as string;
    res.json({
      result: LSMessage
    })
  })

  const server = _user.listen(BASE_USER_PORT + userId, () => {
    console.log(
      `User ${userId} is listening on port ${BASE_USER_PORT + userId}`
    );
  });

  return server;
}
