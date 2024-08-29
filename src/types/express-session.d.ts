import 'express-session';

declare module 'express-session' {
interface Session {
  user?: {
    username?: string;
    email?: string; 
    role?: string;
    [key: string]: any;
  };
}
}