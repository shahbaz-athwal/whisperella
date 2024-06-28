interface Message {
    id: number
    content: string;
    createdAt: Date;
}

export interface ApiResponse{
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?: Message[];
}