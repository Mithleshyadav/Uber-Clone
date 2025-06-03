const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

function initializeSocket(server) {
  io = socketIo(server, {
    cors: {
      origin: '*',
      methods: [ 'GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    socket.on('join', async (data) => {
      const { userId, userType } = data;

      if(userType === 'user') {
        await userModel.findByIdAndUpdate(userId, {socketId: socket.id});
      } 
       if(userType === 'captain') {
        await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
       }
    });


    socket.on('update-location-captain', async (data) => {
      const { userId, location } = data;

      if( !location || !location.ltd || !location.lng) {
        return socket.emit('error', { message: 'Invalid location data'});
      }

      await captainModel.findByIdAndUpdate(userId, {
        location: {
          ltd: location.ltd,
          lng: location.lng
        }
      });
      
    });

    socket.on('disconnect', () => {
      console.log(`client disconnected: ${socket.id}`);
    });


  })
}


module.exports = { initializeSocket };