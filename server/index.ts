import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import { allWord } from "./allWord";

const app = express();
app.use(cors());

const port = 7777;
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

let drawer: any = null;
let users: any = {};
let canvasState: any = null;
let timer: any = null;
let countDownInterval: any = null;
let remainingTime: any = null;
let selectedWord: any = null;
let drawersWhoSelectedWord: any = new Set();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("user-info", (data) => {
    const { name, userId } = data;
    users[socket.id] = { name, userId };
    socket.emit("user-id", userId);
    console.log(data);

    if (!drawer) {
      drawer = userId;
      io.emit("select-drawer", drawer);
      console.log("Drawer selected:", drawer, userId);
      selectWord();
    } else {
      socket.emit("select-drawer", drawer);
    }
  });

  socket.on("client-ready", () => {
    if (canvasState) {
      socket.emit("canvas-state-from-server", canvasState);
    } else {
      socket.broadcast.emit("get-canvas-state");
    }
  });

  socket.on("canvas-state", (state) => {
    canvasState = state;
    socket.broadcast.emit("canvas-state-from-server", state);
  });

  socket.on("draw", (data) => {
    socket.broadcast.emit("draw", data);
  });

  socket.on("word-selected", (data) => {
    selectedWord = data;
    drawersWhoSelectedWord.add(drawer);
    startTimer();
  });

  socket.on("clear", () => {
    io.emit("clear");
    canvasState = null;
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    const disconnectedUserId = users[socket.id]?.userId;
    delete users[socket.id];

    if (Object.keys(users).length === 0) {
      drawer = null;
      clearTimeout(timer);
      clearInterval(countDownInterval);
      canvasState = null;
      timer = null;
      console.log("All users disconnected, drawer cleared and timer stopped.");
    } else if (disconnectedUserId === drawer) {
      drawer = null;
      selectNewDrawer();
    }
  });

  function selectNewDrawer() {
    const userIds = Object.values(users).map((user: any) => user.userId);
    const remainingDrawers = userIds.filter(
      (id) => !drawersWhoSelectedWord.has(id)
    );

    if (remainingDrawers.length > 0) {
      drawer =
        remainingDrawers[Math.floor(Math.random() * remainingDrawers.length)];
    } else {
      drawersWhoSelectedWord.clear();
      drawer = userIds[Math.floor(Math.random() * userIds.length)];
    }

    console.log("New drawer selected:", drawer);
    io.emit("select-drawer", drawer);
    io.emit("clear");
    canvasState = null;
    selectedWord = null;
    selectWord();
  }

  function startTimer() {
    if (timer) {
      clearTimeout(timer);
      clearInterval(countDownInterval);
      canvasState = null;
    }
    remainingTime = 60000;
    countDownInterval = setInterval(() => {
      remainingTime -= 1000;
      io.emit("time", { remainingTime });
      if (remainingTime <= 0) {
        clearInterval(countDownInterval);
        selectNewDrawer();
      }
    }, 1000);

    timer = setTimeout(() => {
      selectNewDrawer();
    }, remainingTime);
  }

  function selectWord() {
    const words: any = [];
    while (words.length < 3) {
      const word: any = allWord[Math.floor(Math.random() * allWord.length)];
      if (!words.includes(word)) {
        words.push(word);
      }
    }
    const drawerSocketId = Object.keys(users).find(
      (key) => users[key].userId === drawer
    );
    if (drawerSocketId) {
      io.to(drawerSocketId).emit("select-word", words); // Emit to the current drawer only
    }
  }
});

server.listen(port, () => {
  console.log("Server is up and running on port", port);
});
