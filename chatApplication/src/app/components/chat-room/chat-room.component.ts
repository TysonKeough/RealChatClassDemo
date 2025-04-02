import { Component, inject, Input, input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from '../../services/message.service';
import { userData } from '../../Types/user';
import { FriendsService } from '../../services/friends.service';
import { ChatRoomMessage } from '../../Types/message';
import { WebSocketService } from '../../services/web-socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-room',
  imports: [ReactiveFormsModule],
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.scss'
})
export class ChatRoomComponent implements OnChanges, OnInit {
  friendService = inject(FriendsService);
  messageService = inject(MessageService);
  webSocketService = inject(WebSocketService);

  messageForm = new FormGroup({
    message: new FormControl('')
  });

  @Input() chatroomFriendInfo: {username: string} = {username: ''};
  @Input() chatRoomMessages: ChatRoomMessage = null;
  // {_id: '',chatroomId: '',userId: '',content: '',timestamp: '',__v: 0,}
  // receive userData from Home component...
  userData = input<userData>();

  // Create state so we can change 
  chatRoomState = input('friend');

  chatRoomID = input('');

  //get user id

  //get chatroomID

  convertTime(timestamp : string): string{ //converts the timestamp into a more readable format
    return new Date(timestamp).toLocaleString();//ISO to local (this includes the date and time - local is based on device settings)
  }

  private subscription: Subscription | null = null;

  ngOnInit(): void {
    // set curchatroom id to blank
    this.friendService.curChatroomId = '';


    this.subscription = this.webSocketService.myVariable$.subscribe((newValue) => {
      
      console.log("the change to booolean in webSOCKEEE is tracked...");
      console.log('Variable changed to:', newValue); // For example, log to console

      

      this.getData();


    });

    

  }

  // ngOnDestroy() {
  //   // Always unsubscribe to avoid memory leaks
  //   if (this.subscription) {
  //     this.subscription.unsubscribe();
  //   }
  // }

  getData() {
    this.messageService.getMessages(this.friendService.curChatroomId).subscribe(res => {
      console.log("getting data....");
      //set message array to @Input
      this.chatRoomMessages = res;
      console.log(res);
    });
  }


  ngOnChanges(changes: SimpleChanges): void {

    // get messages for current chatroom
    this.messageService.getMessages(this.friendService.curChatroomId).subscribe(res => {
      console.log("response recieved from get chatroom messages...");
      //set message array to @Input
      this.chatRoomMessages = res;


    });
    
  }


  // Test POST for a new message in the chatroom...
  onSubmitMessage() {

    const messageRequest = {
      chatRoomId: this.friendService.curChatroomId,
      username: this.userData()?.user.username,
      userId: this.userData()?.user._id,
      message: this.messageForm.value.message,
    }

    console.log("this is message Request: ", messageRequest);

    //emit from web-socket service
    this.webSocketService.emitMessage(messageRequest);

    this.messageForm.reset();//so it clears the message input field, reset()s to default values - which is blank here

    // this.messageService.sendMessage(messageRequest).subscribe(response => {
    //   console.log("Response from post message...",response);
    // });



  }


}
