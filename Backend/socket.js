// const socketIo = require('socket.io')
// const userModel = require('./models/user.model')
// const captainModel = require('./models/captain.model')

// let io

// function initializeSocket (server) {
//   io = socketIo(server, {
//     cors: {
//       origin: '*',
//       methods: ['GET', 'POST']
//     }
//   })

//   io.on('connection', socket => {
//     console.log(`New client connected: ${socket.id}`)

//     socket.on('join', async data => {
//       const { userId, userType } = data

//       if (userType === 'user') {
//         await userModel.findByIdAndUpdate(userId, { socketId: socket.id,
//           status: 'active'
//          })
//       }
//       if (userType === 'captain') {
//         await captainModel.findByIdAndUpdate(userId, { socketId: socket.id,
//           status: 'active'
//          })
//       }
//     })

//     socket.on('update-location-captain', async data => {
//       const { userId, location } = data

//       if (!location || !location.lat || !location.lng) {
//         return socket.emit('error', { message: 'Invalid location data' })
//       }

//       await captainModel.findByIdAndUpdate(userId, {
//         location: {
//           type: 'Point',
//           coordinates: [location.lng, location.lat] // [longitude, latitude]
//         }
//       })
      
//     })

//     socket.on('disconnect', () => {
//       console.log(`client disconnected: ${socket.id}`)
//     })
//   })
// }

// const sendMessageToSocketId = (socketId, messageObject) => {

// console.log(messageObject);

//     if (io) {
//         io.to(socketId).emit(messageObject.event, messageObject.data);
//     } else {
//         console.log('Socket.io not initialized.');
//     }
// }

// module.exports = { initializeSocket, sendMessageToSocketId };


const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

function initializeSocket(server) {
  io = socketIo(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`🟢 New client connected: ${socket.id}`);

    // 🟡 Handle 'join' from user or captain
    socket.on('join', async (data) => {
      const { userId, userType } = data;
      try {
        if (userType === 'user') {
          await userModel.findByIdAndUpdate(userId, {
            socketId: socket.id,
            status: 'active',
          });
          console.log(`✅ User ${userId} joined with socketId ${socket.id}`);
        }

        if (userType === 'captain') {
          await captainModel.findByIdAndUpdate(userId, {
            socketId: socket.id,
            status: 'active',
          });
          console.log(`✅ Captain ${userId} joined with socketId ${socket.id}`);
        }
      } catch (err) {
        console.error('❌ Error handling join:', err.message);
      }
    });

    // 🟡 Handle location updates from captain
    socket.on('update-location-captain', async (data) => {
      const { userId, location } = data;

      if (!location || !location.lat || !location.lng) {
        return socket.emit('error', { message: 'Invalid location data' });
      }

      try {
        await captainModel.findByIdAndUpdate(userId, {
          location: {
            type: 'Point',
            coordinates: [location.lng, location.lat], // [longitude, latitude]
          },
        });
        console.log(`📍 Updated location for captain ${userId}`);
      } catch (err) {
        console.error('❌ Failed to update captain location:', err.message);
      }
    });

    // 🔴 Handle disconnection
    socket.on('disconnect', async () => {
      console.log(`🔴 Client disconnected: ${socket.id}`);

      try {
        const user = await userModel.findOne({ socketId: socket.id });
        if (user) {
          user.socketId = null;
          user.status = 'inactive';
          await user.save();
          console.log(`🛑 User ${user._id} set to inactive`);
        }

        const captain = await captainModel.findOne({ socketId: socket.id });
        if (captain) {
          captain.socketId = null;
          captain.status = 'inactive';
          await captain.save();
          console.log(`🛑 Captain ${captain._id} set to inactive`);
        }
      } catch (err) {
        console.error('❌ Error handling disconnect:', err.message);
      }
    });
  });
}

// ✅ Helper to send message to a specific socket
const sendMessageToSocketId = (socketId, messageObject) => {
  if (!io) {
    return console.log('❌ Socket.io not initialized.');
  }

  const targetSocket = io.sockets.sockets.get(socketId);
  if (targetSocket) {
    console.log(`📤 Sending '${messageObject.event}' to socketId: ${socketId}`);
    targetSocket.emit(messageObject.event, messageObject.data);
  } else {
    console.warn(`⚠️ No active socket found for socketId: ${socketId}`);
  }
};

module.exports = {
  initializeSocket,
  sendMessageToSocketId,
};
