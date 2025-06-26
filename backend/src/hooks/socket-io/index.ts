import { Server } from 'socket.io'

export default ({ strapi }: { strapi: any }) => {
  return {
    async register() {
      // Hook will be initialized after server starts
    },

    async bootstrap() {
      const io = new Server(strapi.server.httpServer, {
        cors: {
          origin: process.env.CLIENT_URL || "http://localhost:5173",
          methods: ["GET", "POST"],
          credentials: true
        },
        transports: ['websocket', 'polling']
      })

      // Store io instance globally
      strapi.io = io

      // Connection handling
      io.on('connection', (socket) => {
        console.log(`🔌 Client connected: ${socket.id}`)

        // Join photo-specific rooms for targeted updates
        socket.on('join-photo', (photoId: string) => {
          socket.join(`photo:${photoId}`)
          console.log(`📸 Socket ${socket.id} joined photo:${photoId}`)
        })

        // Handle photo likes
        socket.on('photo:like', async (data: { photoId: string }) => {
          try {
            const { photoId } = data

            // Create like record
            const like = await strapi.entityService.create('api::like.like', {
              data: {
                photo: photoId,
                ipAddress: socket.handshake.address,
                sessionId: socket.id
              }
            })

            // Get updated like count
            const likeCount = await strapi.db.query('api::like.like').count({
              where: { photo: photoId }
            })

            // Update photo like count
            await strapi.entityService.update('api::photo.photo', photoId, {
              data: { likeCount }
            })

            // Broadcast to all clients viewing this photo
            io.to(`photo:${photoId}`).emit('photo:like-update', {
              photoId,
              likeCount,
              socketId: socket.id
            })

            console.log(`❤️ Photo ${photoId} liked. New count: ${likeCount}`)

          } catch (error) {
            console.error('❌ Like error:', error)
            socket.emit('error', { message: 'Failed to process like' })
          }
        })

        // Handle photo views
        socket.on('photo:view', async (data: { photoId: string }) => {
          try {
            const { photoId } = data
            
            // Increment view count
            const photo = await strapi.entityService.update('api::photo.photo', photoId, {
              data: {
                viewCount: { $inc: 1 }
              }
            })

            // Broadcast view count update
            io.to(`photo:${photoId}`).emit('photo:view-update', {
              photoId,
              viewCount: photo.viewCount
            })

            console.log(`👁️ Photo ${photoId} viewed. New count: ${photo.viewCount}`)

          } catch (error) {
            console.error('❌ View tracking error:', error)
          }
        })

        // Disconnection handling
        socket.on('disconnect', () => {
          console.log(`🔌 Client disconnected: ${socket.id}`)
        })
      })

      console.log('🚀 Socket.IO server initialized')
    }
  }
} 