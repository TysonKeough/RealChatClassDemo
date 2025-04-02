import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { RegisterResponse, UserRegister } from '../Types/todo.type';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  // HTTP client to create requests to server....
  http = inject(HttpClient);
    postNewUser(e: any): Observable<any> {
      // const url = 'https://jsonplaceholder.typicode.com/todos';
      
      // return this.http.get<Array<Todo>>(url);
      // let response2: RegisterResponse = {message:"",success:false,url:"",id:"",code:""};
      let response:any;

      // return this.http.post<UserRegister>('/api/user/new', e);
      // POST to '/api/user/new' to create a new user in database
      return this.http.post<UserRegister>(`${environment.apiRoute}/user/new`, e,{withCredentials:true});
      
      
    }





  constructor() { }
}
