import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { inject } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WebSocketService } from '../services/web-socket.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginFail = false;
constructor(private router: Router) {}
  loginService= inject(LoginService);
  socketService = inject(WebSocketService);

  public responseLogin:any;

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
    this.loginFail = false;
    //POST data if information is good 

    // this.loginService.postLoginUserAxios(this.userLoginForm.value);


    this.loginService.postLoginUser(this.userLoginForm.value).subscribe(e => {
      this.responseLogin = e;
      //route to certain page on good response
    // console.log("response from register: ", e);
      if(this.responseLogin.success){//checks if login was successful
        console.log("printing response after subscribe received response...:",this.responseLogin);
        // change route once response is received and is good
        this.router.navigate([`${this.responseLogin.url}`]);

        //login is good, so we need to establish web socket connection with server...
        this.socketService.establishSocket();
        console.log("initialize socket function prob just ran...");


      }else{
        this.loginFail = true;//if it wasn't successful toggle this - this triggers the "Incorrect username or password" text

      }
    });
    
    // TODO: Use EventEmitter with form value
    console.warn(this.userLoginForm.value);

  }

  redirectToRegister() {

    this.router.navigate(['/register']);

  }


}
