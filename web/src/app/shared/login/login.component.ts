import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private isCurrentlyLoggedIn = false;
  private loginData = {
    username: "",
    password: ""
  }

  constructor(private authService: AuthService) {
    
  }

  ngOnInit() {
    this.authService.CurrentToken.subscribe(data => {
      this.isCurrentlyLoggedIn = data !== null;
      this.loginData.username = "";
      this.loginData.password = "";
    })
  }

  login() {
    this.authService.login(this.loginData);
  }

  logout() {
    this.authService.logout();
  }

}
