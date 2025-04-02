import { Component, inject, OnInit, signal } from '@angular/core';

import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RegisterService } from '../services/register.service';
import { Router } from '@angular/router';
import { RegisterResponse } from '../Types/todo.type';
import { WebSocketService } from '../services/web-socket.service';


@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  constructor(private router: Router) {}
registerService = inject(RegisterService);
socketService = inject(WebSocketService);

 
  // todoItems = signal<Array<Todo>>([]);

  userRegisterForm = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
    age: new FormControl(),
    password: new FormControl(),
    country: new FormControl(),
    gender: new FormControl(),
    // be blank on register and user can fill in on profile page later...
    bio: new FormControl('')
  })

  public response:any;

  //on form submit callback...
  onSubmit() {
    //Check database for users with same name or email...

    //POST data if information is good 
    const response = this.registerService.postNewUser(this.userRegisterForm.value).subscribe(e => {
      this.response = e;
      //route to certain page on good response
    // console.log("response from register: ", e);
    console.log("printing response after subscribe received response...:",this.response);
    this.router.navigate([`${e.url}`]);
    this.socketService.establishSocket();

    });

    // this.router.navigate([`${response.url}`]);
    
    
    //route to certain page on good response
    // console.log("response from register: ", response);
    // this.router.navigate([`${response}`]);

    // TODO: Use EventEmitter with form value
    console.log(this.response);
    console.warn(this.userRegisterForm.value);
  }






}
