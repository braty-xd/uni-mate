import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  hide=true
  isLoading = false
  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

  onSignIn(form: NgForm) {
    if(form.invalid){
      console.log("asd")
      return;
    }else{
      console.log("asd")
      this.authService.login(form.value.email,form.value.passwd)
    }
  }

}
