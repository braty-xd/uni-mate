import { Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.

  title = 'project';
  background = "primary"
  isLoggedIn = false
  private authListenerSubs: Subscription
  constructor(private authService: AuthService){}

  ngOnInit(){
    this.authService.autoAuthUser()
    this.isLoggedIn = this.authService.getIsAuth()
    
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.isLoggedIn = isAuthenticated
    })
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe()
  }

  onLogout(){
    //this.isLoggedIn = false
    this.authService.logout()
  }


}
