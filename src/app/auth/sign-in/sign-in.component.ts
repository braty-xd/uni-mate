import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import {
  MatSnackBar,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  hide=true
  isLoading = false
  constructor(public authService: AuthService,private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  onSignIn(form: NgForm) {
    if(form.invalid){
      console.log("asd")
      return;
    }else{
      console.log("asd")
      this.authService.login(form.value.email,form.value.passwd,this._snackBar)
    }
  }

}
