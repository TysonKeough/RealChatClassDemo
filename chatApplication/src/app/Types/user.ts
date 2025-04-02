

export type messageRequest = {
  chatRoomId: string;
  userId: string | undefined; 
  message: string | null | undefined;
};


export type userData = {
    user: {
        _id: string;
        username: string;
        bio: string;
        age: number;
        email: string;
        password: string;
        // country: string | null | undefined;
        // gender: string | null | undefined;
        friendRequests: string[];
        friends: string[];
        chatRooms: {
          chatRoomId: string;
          notifications: number;
          userId: String;
        }[]
        __v: number;
    }
  } | null;


  export type userDataArray = {
        _id: string;
        username: string;
        bio: string;
        age: number;
        email: string;
        password: string;
        // country: string | null | undefined;
        // gender: string | null | undefined;
        friendRequests: string[];
        friends: string[];
        chatRooms: {
          chatRoomId: string;
          notifications: number;
          userId: String;
        }[]
        __v: number;
  }[];



  export type friend = {
    _id: string;
    username: string;
    chatRooms: {
      chatRoomId: string;
      notifications: number;
    }[]
  }[];