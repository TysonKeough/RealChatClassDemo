import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule,RouterLink,RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private router: Router) {}

    loginService = inject(LoginService);
    public dataResponse = {};

  //function used to log user out...
  logout(){
    console.log("log out button clicked... ahahha");
    this.dataResponse = this.loginService.postLogoutUser();
    //route user to login page
    this.router.navigate(['/login']);
  }
  isAuth(){
    console.log('check auth just clicked');
    this.loginService.isAuthenticated();
  }
}
