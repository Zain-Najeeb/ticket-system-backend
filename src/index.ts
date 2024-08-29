import express from 'express';
import session from 'express-session';
import authRoutes from './routes/auth';
import Redis from 'ioredis';
import RedisStore from "connect-redis"
import { setupDatabase } from './database/initial';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const redisClient = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
});
setupDatabase();
const sessionSecret = process.env.SESSION_SECRET || 'ce77ed94-40e2-4f67-9855-2b538357d363'
console.log(sessionSecret);
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
app.use(session({
  store: new RedisStore({
    client: redisClient,
    prefix: "myapp:",
  }),
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60
  }
}));




app.use('/auth', authRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
