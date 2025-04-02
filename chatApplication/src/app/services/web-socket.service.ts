import { inject, Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { ProfileService } from './profile.service';
import { HomeComponent } from '../home/home.component';
import { FriendsService } from './friends.service';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  constructor(private http: HttpClient) { } 
  profileService = inject(ProfileService);
  friendService = inject(FriendsService);

  local_DEV = "http://localhost:8080/";

  // Create a BehaviorSubject to hold the variable value
  private _myVariableSubject = new BehaviorSubject<boolean>(false);
  // Expose the observable to other parts of the app
  myVariable$ = this._myVariableSubject.asObservable();

  //  for notifications
  private notif = new BehaviorSubject<boolean>(false);
  notifVar = this.notif.asObservable();

  // Method to change the value of the variable
  changeMyVariable(newValue: boolean) {
    console.log("change value called, and old value was ", !newValue);
    this._myVariableSubject.next(newValue); // This emits the new value
  }

  // change notif
  changeNotif(newValue: boolean) {
    console.log("notif change value has called NIG");
    this.notif.next(newValue);
  }

//Websocket connection
////////////////////////////////////////////////////////////////////////////////////////////////////////////






////////////////////////////////////////////////////////////////////////////////////////////////////////////


}
