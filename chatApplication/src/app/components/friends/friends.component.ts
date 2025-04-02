import { Component, inject,  Input,  input,  OnChanges,  OnInit,  signal, SimpleChanges } from '@angular/core';
import { HomeComponent } from '../../home/home.component';
import { FriendsService } from '../../services/friends.service';
import { ProfileService } from '../../services/profile.service';
import { catchError, Subscription } from 'rxjs';
import { userData, userDataArray, friend } from '../../Types/user';
import { WebSocketService } from '../../services/web-socket.service';
import { MessageService } from '../../services/message.service';
@Component({
  selector: 'app-friends',
  imports: [],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.scss'
})
export class FriendsComponent implements OnInit,OnChanges {

  animateOut = false; //for playing the text animation for friend request status - starts false, will be true when playing

  // Services
  friendService = inject(FriendsService);
  profileService = inject(ProfileService);
  webSocketService = inject(WebSocketService);
  messageService = inject(MessageService);

  // Inputs
  @Input() friendList: userDataArray = [];
  @Input() friendRequests: userDataArray = [];
  @Input() dummy: boolean = false;

  @Input() userDataFriends: userData = null;
  // friends = input<friend>([]);
  // friendRequests = input<userDataArray>([]);

  // @Input() setter(id: string | null){

  // }

requestSuccess: any; 
// friends : friend = [];
// friendRequests : userDataArray = [];

response : any;
isFriendRequestOn : boolean = false;

private subscription: Subscription | null = null;


jankUpdate: boolean = false;

  // call this to chat the state of home component
  // changeHome() {
    
  //   this.chatRoomStatePass.set('friends');
  // }

  
  ngOnInit() : void{
    this.friendService.getFriendRequest().subscribe(e =>{
      this.friendRequests = e;
    });

    this.friendService.getFriends().subscribe(e =>{
      this.friendList = e;
      console.log("friends",e);
      // console.log(e);
    });


    // notificiations
    this.subscription = this.webSocketService.notifVar.subscribe((newValue) => {
      
      console.log("the change to booolean in webSOCKEEE is tracked...");
      console.log('Variable changed to:', newValue); // For example, log to console
      // this.updateNotifs();

    });
  }

  // updateNotifs() {
  //   this.webSocketService.update().subscribe(e =>{
  //     // this.friends = e;
  //     console.log("response from update notifs...", e);
  //     this.friendList = e;
  //     // console.log(e);
  //   });
  // }


  ngOnChanges(): void {
    // Grab friends when there is a value change for friend signals
    this.friendService.getFriends().subscribe(e =>{
      // this.friends = e;
      this.friendList = e;
      // console.log(e);
    });

    // Grab friend requests ^^^ 
    this.friendService.getFriendRequest().subscribe(e =>{
      this.friendRequests = e;
    });
  }


  // When a friend is clicked we need to get their chatroom...
  getFriendChatRoom(id: string, username: string) {
    // Get friends ID, and Cur users ID to send in REQ

    //
    this.friendService.setChatRoom(id).subscribe(res => {
      // console.log("response from setting chatroom:",res);
      // Set current chatroom
      this.friendService.curChatroomId = res.id;
      console.log("value of curchatroomId: ",this.friendService.curChatroomId);
      // Set current chat friend info
      this.friendService.curChatFriend = {id: id, username: username};
      // console.log("value of curChatroomFriend: ", this.friendService.curChatFriend);

      // set notifications for this user and this chatRoom to ZERO
      this.messageService.clearNotifications(id , this.friendService.curChatroomId).subscribe(e => {

        console.log(e);
      });

    
    });
  }

  // Notifications
  // maybe store notifications number in users
  // chatRooms: [{chatRoomId: string, notification: number}]
  // Each time the user clicks on the chatroom/friend in friends, we drop notifications down to 0...




  //logic idea: 
    //start with requestSuccess as null - so the message isn't visible
    //on either success or fail set bool to either true or false - to assign the styling & message
    //for either success or fail have a timeout, which once done sets requestSuccess to null again (to hide the message, so it's not always visible)
  toggleFriendRequests() {

    this.isFriendRequestOn = !this.isFriendRequestOn;
    if(!this.jankUpdate) {
      console.log("friend request button clicked...");
      
      this.friendService.getFriendRequest().subscribe(e =>{
        console.log("friend requests....",e);
        this.friendRequests = e;
        this.jankUpdate = !this.jankUpdate;
      });
    }
    else{
      this.friendService.getFriends().subscribe(e =>{
        this.friendList = e;
        console.log("friends",e);
        // console.log(e);
        this.jankUpdate = !this.jankUpdate;
      });
    }
  }

  sendFriendRequest(value:string){
    this.friendService.sendFriendRequest(value).subscribe({
      next: (data) => {
      // console.log('Data:', data);
      this.requestSuccess = true;
      this.dummy = !this.dummy;
      this.animateOut = false; //reset animation 

      setTimeout(() => {
        this.animateOut = true;//play animation
        setTimeout(()=> //after some time hide the message - this way it's not always there
        {
          this.requestSuccess = null; //reset back to null to hide the message
          this.animateOut = false; //stop animation
        }, 1000); 
      }, 3000);
    },
    error: (error) => {
      console.error('Error:', error);
      this.requestSuccess = false;

      setTimeout(() => {
        this.animateOut = true;//play animation
        console.log("animation started");
        setTimeout(()=>{
          this.requestSuccess = null;
          this.animateOut = false;
          console.log("animation finished");
        }, 1000);
      }, 3000);
    }
  })
 
  }


  acceptFriend(num : number){
    const id = this.friendRequests[num]._id;
    this.friendService.acceptFriendRequest(id).subscribe({

      

      // receive accept friend response
      // Send out a request to then create a chatroom for you and your friend...
      next: (response: any) => {
        this.dummy = !this.dummy;
        console.log(response); 
        this.friendService.createChatRoom(response.userIds[0],response.userIds[1]).subscribe(response => {
          console.log("response from creating chatroom: ",response);
        });
      },
      error: (error) => {
        console.error('Error:', error);
      }
  });
  }

  declineFriend(num : number){
    const id = this.friendRequests[num]._id;
    console.log(id);
    this.friendService.declineFriendRequest(id).subscribe(e => {
    });
  }

  removeFriend(id: string) {
      this.friendService.removeFriendApi(id).subscribe(res => {
        console.log('response from delete friend api: ',res);
      });

  }


  chatToLogo() {
    // back to no chatroomid to show logo
    this.friendService.curChatroomId = '';
  }


}
