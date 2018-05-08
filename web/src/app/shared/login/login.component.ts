import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private user = null;
  private loginData = {
    username: "",
    password: ""
  }

  constructor(private authService: AuthService) {
    
  }

  ngOnInit() {
    this.authService.CurrentToken.subscribe(data => {
      this.user = data;
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
