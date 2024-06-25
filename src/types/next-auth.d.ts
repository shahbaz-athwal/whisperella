import 'next-auth'
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface User {
        userId?: string; 
        isVerified?: boolean;
        isAcceptingMessage?: boolean;
        username?: string
    }
    
    interface Session {
        user: User & DefaultSession['user']
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
      userId?: string;
      isVerified?: boolean;
      isAcceptingMessage?: boolean;
      username?: string;
    }
  }