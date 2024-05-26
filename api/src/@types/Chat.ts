interface Chats {
    _id: string;
    userId1: string;
    userId2: string;
    messages: Message[];
    createdAt: string;
    updatedAt: string;
  }
  
  interface Message {
    _id: number;
    senderId: number;
    message: string;
    seen: boolean;
    type: "standard" | "reply";
    format: "text" | "image" | "video" | "audio" | "file";
    url?: string;
    isDownloaded?: boolean;
    replyTo?: string;
    reactions: Reaction;
    createdAt: string;
    updatedAt: string;
  }
  
  interface Reaction {
    [key: string]: number;
  }
  
  export { Chats, Message, Reaction };
  