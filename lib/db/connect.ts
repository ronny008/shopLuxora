import mongoose from 'mongoose';
import dns from 'dns';

// Force DNS resolution to Google Public DNS to avoid local ISP DNS issues with MongoDB SRV records
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch {
  // Ignore if unable to set servers in certain environments
}

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://ronythessery:123123124@cluster0.fx1tiil.mongodb.net/ebill?retryWrites=true&w=majority&appName=Cluster0';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // Ensure DNS is set before connecting
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  } catch {
    // Ignore
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('Connected to MongoDB Atlas successfully.');
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('MongoDB Atlas connection failed:', e);
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
