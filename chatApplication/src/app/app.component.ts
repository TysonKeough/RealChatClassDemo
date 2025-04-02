import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginService } from './services/login.service';


@Component({
  selector: 'app-root',
  // standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule],
  // templateUrl: './app.component.html',
  template: `

@if (this.isAuthSignal) {
  <!-- <app-header/> -->
  <router-outlet/>
  
}
@else {
  <router-outlet/>
}

  
  
`
  
})
// styleUrl: './app.component.scss'
export class AppComponent implements OnInit{
  isAuth = inject(LoginService)
  title = 'chatApplication';
  // public isAuthSignal = signal(false);
  public isAuthSignal = false;



signalRender(state: boolean){
  // this.isAuthSignal.set(state);
  this.isAuthSignal = state;
}

  

//run when component is initiated...
ngOnInit(): void {
  this.isAuth.isAuthenticated().subscribe(isAuthState => {
    console.log("auth state is: ", isAuthState.isAuthenticated);
    this.signalRender(isAuthState.isAuthenticated);
    this.isAuth.setUserAuthenticated(isAuthState.isAuthenticated);
  });
  console.log("App component has been loaded...")
}
}
