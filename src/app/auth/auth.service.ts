import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthData } from "./auth-data.model"
import {Router} from "@angular/router"
import { Subject } from "rxjs";

@Injectable({providedIn:"root"})
export class AuthService{
    private token: string;
    private isAuth = false;
    private tokenTimer: any
    private authStatusListener = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router) {}

    getToken() {
        return this.token
    }

    getIsAuth(){
        return this.isAuth
    }
    getAuthStatusListener() {
        return this.authStatusListener.asObservable()
    }

    createUser(email: string, passwd: string) {
        const authData: AuthData = {
            email: email,
            passwd: passwd
        }
        this.http.post("http://localhost:3000/api/users/sign-up",authData)
        .subscribe(response => {
            console.log(response)
        })
    }

    login(email: string, passwd: string) {
        const authData: AuthData = {
            email: email,
            passwd: passwd
        }
        this.http.post<{token: string, expiresIn: number}>("http://localhost:3000/api/users/sign-in",authData)
        .subscribe(result => {
            const token = result.token
            this.token = token
            if(token){
                const expireDuration = result.expiresIn
                this.setAuthTimer(expireDuration)
                this.isAuth = true
                this.authStatusListener.next(true)
                const now = new Date()
                const expDate = new Date(now.getTime() + (expireDuration * 1000))
                this.saveAuthData(token,expDate)
            }
            
            //this.router.navigate(["/"]);
        })
    }

    logout(){
        this.token = null
        this.isAuth = false
        this.authStatusListener.next(false)
        clearTimeout(this.tokenTimer)
        this.clearAuthData()
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

    private saveAuthData(token: string, expirationDate: Date) {
        localStorage.setItem('token',token)
        localStorage.setItem('expiration',expirationDate.toISOString())
    }

    private clearAuthData() {
        localStorage.removeItem('token')
        localStorage.removeItem('expiration')
    }

    private getAuthData() {
        const token = localStorage.getItem("token")
        const expirationDate = localStorage.getItem("expiration")
        if(!token || !expirationDate) {
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate)
        }
    }
}