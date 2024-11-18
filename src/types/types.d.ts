import 'next-auth'
import { DefaultSession } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
    interface User {
        userId?: string; 
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string
    }
    
    interface Session {
        user: User & DefaultSession['user']
    }
}

declare module 'next-auth/jwt' {
    interface JWT extends DefaultJWT {
      userId?: string;
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
      username?: string;
    } 
  }