import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChatRoomMessage, Message } from '../Types/message';
import { Observable } from 'rxjs';
import { messageRequest } from '../Types/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) { }

  

  // HTTP post new message...
  sendMessage(message: messageRequest) {
    return this.http.post<messageRequest>(`${environment.apiRoute}/message/new`,message,{withCredentials:true});
  }

  // GET messages for a chatroom
  getMessages(id: string) {
    return this.http.get<ChatRoomMessage>(`${environment.apiRoute}/message/${id}`,{withCredentials:true});
  }


  clearNotifications(id : string, chatRoomId : string){
    return this.http.post(`${environment.apiRoute}/message/notif/remove/${id}`, { chatRoomId },{withCredentials:true});
    
  }

}
