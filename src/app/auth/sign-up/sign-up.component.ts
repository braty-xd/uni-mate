import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  hide = true
  isLoading = false
  constructor(public authService:AuthService) { }

  ngOnInit(): void {
  }

  onSignUp(form: NgForm) {
    if(form.invalid){
      return;
    }else{
      this.authService.createUser(form.value.email,form.value.passwd)
    }
  }

}
