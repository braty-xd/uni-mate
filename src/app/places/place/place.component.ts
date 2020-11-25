import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.css']
})
export class PlaceComponent implements OnInit {

  place : Place
  user: any
  isLoading: boolean = false

  constructor(private route: ActivatedRoute, public router: Router,
    public placesService: PlacesService, public authService: AuthService,
    private _location: Location) {    }

  ngOnInit(): void {
    this.isLoading = true
    this.route.queryParams.subscribe(params =>{
      
      this.placesService.getPlace(this.route.snapshot.url[1].path).subscribe(placeData => {
        this.place = {id: placeData._id, title: placeData.title, description: placeData.description, 
          imagePath: placeData.imagePath,city:placeData.city, university:placeData.university,
          rent:+placeData.rent,ownerSex:placeData.ownerSex, owner: placeData.owner};
          this.isLoading = false
          
      })

      this.user = this.authService.getUser(this.route.snapshot.url[1].path).subscribe(user => {
        this.user = user.user
      })

    })
    //console.log(this.route)
  }

  onBackClick() {
    console.log("zaa")
    this._location.back();
  }

  onImageClick(img: string) {
    this.router.navigate(["/","image",img]).then(res => {
      //console.log(this.route)
    })
  }

}
