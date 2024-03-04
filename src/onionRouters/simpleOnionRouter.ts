import bodyParser from "body-parser";
import express from "express";
import { BASE_ONION_ROUTER_PORT } from "../config";
import { exportPrvKey, exportPubKey, generateRsaKeyPair } from "../crypto";

export async function simpleOnionRouter(nodeId: number) {
  const onionRouter = express();
  onionRouter.use(express.json());
  onionRouter.use(bodyParser.json());

  const keyPair = await generateRsaKeyPair()
  

  let lREMessage: string | null = null;
  let lRDMessage: string | null = null;
  let lMDest: Number | null = null;
  // TODO implement the status route
  onionRouter.get("/status", (req, res) => {
    res.send('live')
  });

  const server = onionRouter.listen(BASE_ONION_ROUTER_PORT + nodeId, () => {
    console.log(
      `Onion router ${nodeId} is listening on port ${
        BASE_ONION_ROUTER_PORT + nodeId
      }`
    );
  });

  onionRouter.get("/getLastReceivedEncryptedMessage", (req, res) => {
    lREMessage = req.query.message as string
    res.json({
      result: lREMessage,
    })
  })

  onionRouter.get("/getLastReceivedDecryptedMessage", (req, res) => {
    lRDMessage = req.query.message as string
    res.json({
      result: lRDMessage,
    })
  })

  onionRouter.get("/getLastMessageDestination", (req, res) => {
    lMDest = req.query.message as unknown as number
    res.json({
      result: lMDest,
    })
  })

  onionRouter.post("/registerNode", async (req, res) => {
    res.json({
      id: nodeId,
      pubKey: exportPubKey(keyPair["publicKey"])
    })
  })

  onionRouter.get("/getPrivateKey", (req, res) => {
    res.json({
      result: exportPrvKey(keyPair["privateKey"])
    })
  })

  return server;
}