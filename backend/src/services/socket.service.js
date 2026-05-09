import { Server } from "socket.io";

let io;

const socketService = {
  init: (server) => {
    io = new Server(server, {
      cors: { origin: process.env.CLIENT_URL, methods: ["GET", "POST"] },
    });

    io.on("connection", (socket) => {
      console.log(`Socket connected: ${socket.id}`);

      socket.on("join_room", (userId) => socket.join(userId));

      socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);
      });
    });

    return io;
  },

  emitToUser: (userId, event, data) => {
    if (io) io.to(userId.toString()).emit(event, data);
  },
};

export default socketService;
