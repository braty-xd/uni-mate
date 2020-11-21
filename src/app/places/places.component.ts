import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
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

  constructor(public placesService: PlacesService) { }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true
    this.currentPage = pageData.pageIndex + 1
    this.placesPerPage = pageData.pageSize
    this.placesService.getPlaces(this.placesPerPage,this.currentPage);
  }

  ngOnInit(): void {
    this.isLoading = true
    this.placesSub = this.placesService.getPlaceUpdateListener()
    .subscribe((placeData:{places: Place[], maxPlaces: number}) => {
      this.isLoading = false
      this.places = placeData.places;
      this.maxPlaces = placeData.maxPlaces
    });
    this.placesService.getPlaces(this.placesPerPage,this.currentPage);
  }

  ngOnDestroy() {
    if(this.placesSub){
      this.placesSub.unsubscribe()
    }
    
  }

}
