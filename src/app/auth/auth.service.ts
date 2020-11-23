import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthData } from "./auth-data.model"
import {Router} from "@angular/router"
import { Subject } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({providedIn:"root"})
export class AuthService{
    private token: string;
    private isAuth = false;
    private userId: string
    private hasPlace: boolean
    private tokenTimer: any
    private authStatusListener = new Subject<boolean>();
 

    constructor(private http: HttpClient, private router: Router) {}
    getUserId() {
        return this.userId
    }

    getUser(userId: string) {
        return this.http.get<{hasPlace: boolean, user: any}>(
            "http://localhost:3000/api/users/" + userId
        )
    }

    getToken() {
        return this.token
    }

    getIsAuth(){
        return this.isAuth
    }
    getAuthStatusListener() {
        return this.authStatusListener.asObservable()
    }



    createUser(email: string, passwd: string,snackbar: MatSnackBar){
        const authData: AuthData = {
            email: email,
            passwd: passwd
        }
        this.http.post("http://localhost:3000/api/users/sign-up",authData)
        .subscribe(response => {
            //this.router.navigate(["/"]);
            //window.location.reload();
            snackbar.open("Uyelik Olusturuldu!!!","Geri Don",{duration: 3000})
        }, err => {
            snackbar.open("Bu email zaten kullaniliyor. Baska email ile deneyin","Geri Don",{duration: 3000})
            console.log("KULLANICI VAR")
        })
    }

    updateUserCity(userId:string, city: string, university: string) {
        this.http.put("http://localhost:3000/api/users/" + userId,{city:city,university:university})
        .subscribe(res => {
            this.router.navigate(["/"]);
        })
    }

    updateUserDetails(userId:string, nameSurname: string, sex: string) {
        this.http.put("http://localhost:3000/api/users/" + userId,{nameSurname:nameSurname,sex:sex})
        .subscribe(res => {
            this.router.navigate(["/"]);
        })
    }

    login(email: string, passwd: string,snackbar: MatSnackBar) {
        const authData: AuthData = {
            email: email,
            passwd: passwd
        }
        this.http.post<{token: string, expiresIn: number, userId: string,hasPlace: boolean}>("http://localhost:3000/api/users/sign-in",authData)
        .subscribe(result => {
            const token = result.token
            this.token = token
            if(token){
                this.userId = result.userId
                this.hasPlace = result.hasPlace
                const expireDuration = result.expiresIn
                this.setAuthTimer(expireDuration)
                this.isAuth = true
                this.authStatusListener.next(true)
                const now = new Date()
                const expDate = new Date(now.getTime() + (expireDuration * 1000))
                const userId = result.userId
                this.saveAuthData(token,expDate,userId)
                
            }
            
            this.router.navigate(["/"]);
        }, err => {
            snackbar.open("Kullanici adi ve ya sifre hatali","Geri Don",{duration: 3000})
        })
    }

    logout(){
        this.token = null
        this.isAuth = false
        this.authStatusListener.next(false)
        clearTimeout(this.tokenTimer)
        this.clearAuthData()
        this.router.navigate(["/"]);
    }

    autoAuthUser() {
        const authInformation = this.getAuthData()
        if(!authInformation){
            return
        }
        const now = new Date()
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime()
        const isInFuture = authInformation.expirationDate > now
        if(isInFuture){
            this.token = authInformation.token
            this.userId = authInformation.userId
            this.isAuth = true
            this.setAuthTimer(expiresIn/1000)
            this.authStatusListener.next(true)
            
        }
    }

    private setAuthTimer(duration: number) {
        this.tokenTimer = setTimeout(() => {
            this.logout()
        }, duration * 1000)
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string) {
        localStorage.setItem('token',token)
        localStorage.setItem('userId',userId)
        localStorage.setItem('expiration',expirationDate.toISOString())
    }

    private clearAuthData() {
        localStorage.removeItem('token')
        localStorage.removeItem('expiration')
        localStorage.removeItem('userId')
    }

    private getAuthData() {
        const token = localStorage.getItem("token")
        const expirationDate = localStorage.getItem("expiration")
        const userId = localStorage.getItem("userId")
        if(!token || !expirationDate) {
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate),
            userId: userId
        }
    }
}