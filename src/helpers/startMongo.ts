import { connect } from 'mongoose'
import env from '@/helpers/env'

async function startMongo() {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  }

  const connectWithRetry = async () => {
    try {
      await connect(env.MONGO, options)
      console.log('MongoDB connected successfully')
    } catch (error) {
      console.error(
        'Failed to connect to MongoDB, retrying in 5 seconds...',
        error
      )
      setTimeout(connectWithRetry, 5000)
    }
  }

  await connectWithRetry()
}

export default startMongo
