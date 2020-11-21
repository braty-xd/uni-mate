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
  userIdForPlace: string
  hasPlace:boolean
  private authListenerSubs: Subscription
  constructor(private authService: AuthService){}

  ngOnInit(){
    this.authService.autoAuthUser()
    console.log("sa aq")
    this.isLoggedIn = this.authService.getIsAuth()
    console.log(this.isLoggedIn)
    if(this.isLoggedIn){
      //this.hasPlace = this.authService.getHasPlace()
      //console.log(this.hasPlace)
      this.userIdForPlace = this.authService.getUserId()
    }
    
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.isLoggedIn = isAuthenticated
      if(this.isLoggedIn){
        console.log("yarek")
        this.userIdForPlace = this.authService.getUserId()
        console.log(this.userIdForPlace)
        console.log("fak")
      }
      
    })
    this.isLoggedIn = this.authService.getIsAuth()

  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe()
  }

  onLogout(){
    //this.isLoggedIn = false
    this.authService.logout()
  }


}
