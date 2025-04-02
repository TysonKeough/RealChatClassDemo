import { FormControl } from "@angular/forms";



export type Message = {
    // message: FormConstring;
    message: string;
  }


export type ChatRoomMessage = {
    _id: string;
    chatroomId: string;
    username: string;
    userId: string;
    content: string;
    timestamp: string;
    __v: number;
}[] | null;
