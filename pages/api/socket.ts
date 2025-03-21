
import { listenToDoorsChanges } from "@/lib/doors";
import { listenToOrdersChanges } from "@/lib/orders";
import { listenToUsersChanges } from "@/lib/user";
import type { NextApiRequest } from "next"
import { Server } from "socket.io"



export default function SocketHandler(_req: NextApiRequest, res: any) {
 if (res.socket.server.io) {
    res.end();
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const io = new Server(res.socket.server);

  // Event handler for client connections
  io.on("connection", (socket) => {
    const clientId = socket.id;
    console.log(`client connected. ID: ${clientId}`);

    // Event handler for receiving messages from the client
    socket.on("message", (data) => {
      console.log("Received message From Client:", data);
    });

    listenToDoorsChanges(io)
    listenToOrdersChanges(io)
    listenToUsersChanges(io)
    // eslint-disable-next-line @typescript-eslint/dot-notation

    // Event handler for client disconnections
    socket.on("disconnect", () => {
      console.log("client disconnected.");
    });
  });

  
  // Monkey patching to access socket instance globally.
  (global as any).io = io
  res.socket.server.io = io;
  res.end();



  res.send({})
}