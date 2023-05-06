/**
 * @type {import('socket.io').Server}
 */
const io = require("socket.io")({
  cors: {
    origin: "*",
  },
});

let users = [];
const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};


io.on("connection", (socket) => {
  //when connected
  console.log("user connected");
  //take user id socket id from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get messages
  socket.on("sendMessage", ({ senderId, reciverId, text }) => {
    const user = getUser(reciverId)
    console.log('user->', user);
    io.to(user.socketId).emit('getMessage', {
        senderId,
        text
    })
  });
  
  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

module.exports=io