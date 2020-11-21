import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
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
  isCitySelected: boolean

  constructor(public placesService: PlacesService, private authService: AuthService) { }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true
    this.currentPage = pageData.pageIndex + 1
    this.placesPerPage = pageData.pageSize
    console.log(this.userCity)
    this.placesService.getPlaces(this.placesPerPage,this.currentPage,this.userCity);
  }

  onImageClick(){
    console.log("iojfipewojgwoejrng")
  }

  ngOnInit(): void {
    console.log("aq")
    this.isLoading = true
    this.authService.getUser(localStorage.getItem("userId")).subscribe((user) => {
      console.log(user)
      console.log(user.user.city)
      this.userCity = user.user.city
      if(user.user.city){
        this.isCitySelected  = true
      }else{
        this.isCitySelected  = false
      }
      console.log(this.isCitySelected)
      this.placesService.getPlaces(this.placesPerPage,this.currentPage,this.userCity);
    })
    this.placesSub = this.placesService.getPlaceUpdateListener()
    .subscribe((placeData:{places: Place[], maxPlaces: number}) => {
      this.isLoading = false
      this.places = placeData.places;
      this.maxPlaces = placeData.maxPlaces
      console.log(this.places)
    });
    console.log("aq")
    console.log(this.userCity)
    
    console.log(this.places)
  }


  ngOnDestroy() {
    if(this.placesSub){
      this.placesSub.unsubscribe()
    }
    
  }

}
