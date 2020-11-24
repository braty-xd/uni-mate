import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';
import { PlacesService} from "./places.service"

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.css']
})
export class PlacesComponent implements OnInit, OnDestroy {

  places: Place[] = []
  private placesSub: Subscription
  isLoading = false
  placesPerPage = 2
  currentPage = 1
  maxPlaces = 0
  pageSizeOptions = [1,2,5,10]
  userCity: string
  userUni: string
  userSex: string
  isCitySelected: boolean
  orderByUni: boolean = false
  orderBySex: boolean = false
  maxRent: string = "0"

  constructor(public placesService: PlacesService, private authService: AuthService, 
    private router: Router,public route: ActivatedRoute,) { }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true
    this.currentPage = pageData.pageIndex + 1
    this.placesPerPage = pageData.pageSize
    this.placesService.getPlaces(this.placesPerPage,this.currentPage,this.userCity);
  }

  onImageClick(){
    console.log("iojfipewojgwoejrng")
  }

  ngOnInit(): void {
    this.isLoading = true
    this.authService.getUser(localStorage.getItem("userId")).subscribe((user) => {
      this.userCity = user.user.city
      this.userUni = user.user.university
      this.userSex = user.user.sex  
      if(user.user.city){
        this.isCitySelected  = true
      }else{
        this.isCitySelected  = false
      }
      this.placesService.getPlaces(this.placesPerPage,this.currentPage,this.userCity);
    })
    this.placesSub = this.placesService.getPlaceUpdateListener()
    .subscribe((placeData:{places: Place[], maxPlaces: number}) => {
      this.isLoading = false
      this.places = placeData.places;
      this.maxPlaces = placeData.maxPlaces
    });
    
  }

  onPlaceClick(placeId: string) {
    //sonra ilgilenicem
      this.router.navigate([""],{relativeTo: this.route}).then(res => {
        console.log(this.route)
      })
  }


  onFilterChange() {
    console.log(this.orderBySex,this.orderByUni,this.maxRent)
    console.log(typeof(this.maxRent))
    const searchingSex = this.orderBySex ? this.userSex : null
    const searchingUni = this.orderByUni ? this.userUni : null
    const searchingMaxRent = "0" !== this.maxRent ?  this.maxRent: null
    this.placesService.getPlaces(this.placesPerPage,this.currentPage,this.userCity
      ,searchingUni,searchingSex,searchingMaxRent);
  }


  ngOnDestroy() {
    if(this.placesSub){
      this.placesSub.unsubscribe()
    }
    
  }


}
