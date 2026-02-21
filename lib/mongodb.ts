import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Use global variable to maintain connection across hot reloads in dev
const globalWithMongoose = global as typeof global & {
  mongoose: MongooseCache;
};

let cached: MongooseCache = globalWithMongoose.mongoose || {
  conn: null,
  promise: null,
};

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = cached;
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
