import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { ProfileComponent } from '../components/profile/profile.component';
import { ChatRoomComponent } from '../components/chat-room/chat-room.component';
import { FriendsComponent } from '../components/friends/friends.component';
import { userData } from '../Types/user';
import { ProfileService } from '../services/profile.service';
import { AppComponent } from '../app.component';
import { FriendsService } from '../services/friends.service';

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule, ProfileComponent, FriendsComponent, ProfileComponent, ChatRoomComponent], //profile component on the right of home 
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  constructor(private router: Router) {}
  loginService= inject(LoginService);
  friendService = inject(FriendsService);
  profileService = inject(ProfileService);

  // Store cur user data to be able to pass to children
  public userData = signal<userData>(null);
  //store chatRoomID
  //somehow someway we need to GET a list of friends and their main info, display it
  //then pass the common CHATROOM ID down to this signal to go to Chatroom Component
  //public chatRoomId = signal('');

  //chatroomState
  public chatRoomStatePass = signal('friend');

  //current users ID
  public curUserData = signal<userData>(null);

  //callback to set user

  public dataResponse = {};

  public responseLogin:any;

  isUserAuth = this.loginService.isUserAuthenticated;


  setAuthState() {

  }
  

  // we should move login form HTML code to register page.
  loginClosed = true; //if the login popup is visible or not. 
  showLogin(){
    this.loginClosed = false;
  }
  closeLogin(){
    this.loginClosed = true;
  }


  userLoginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(),
  })

  //on form submit callback... to login a user...
  onSubmit() {
    //Check database for users with same name or email...

    //POST data if information is good 
    this.loginService.postLoginUser(this.userLoginForm.value).subscribe(e => {
      this.responseLogin = e;
      //route to certain page on good response
    // console.log("response from register: ", e);
    // console.log("printing response after subscribe received response...:",this.responseLogin);
    this.router.navigate([`${this.responseLogin.url}`]);
    });;

    
    // TODO: Use EventEmitter with form value
    console.warn(this.userLoginForm.value);
  }



  

  //function used to log user out...
  logout(){
    console.log("log out button clicked... ahahha");
    this.dataResponse = this.loginService.postLogoutUser();
    //route user to login page
    this.router.navigate(['/login']);
  }
  isAuth(){
    console.log('check auth just clicked');
    this.loginService.isAuthenticated().subscribe(res => {
        console.log(res);
        console.log('data from profile service userData: ',this.profileService.userData);
    });
  }


  //run when component is initiated...
  ngOnInit(): void {

    // axios
    // const userDataReturned = this.profileService.getMeAxios();
    // this.curUserData.set(userDataReturned);
    // this.profileService.setUserData(userDataReturned?.user._id);
    console.log("BEFORE GET ME HOME INIT");
    this.profileService.getMe().subscribe((data) => {
      console.log('Your data of yourself',data);
      // set user data in home
      this.userData.set(data);

      //set user data in profile service
      this.profileService.setUserData(data?.user._id);
    });
    console.log("Profile component has been loaded...")
  }

}
