import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { PlacesService } from "../places/places.service"
import { Place } from "../places/place.model"
import { mimeType } from "./mime-type.validator"
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-my-place',
  templateUrl: './my-place.component.html',
  styleUrls: ['./my-place.component.css']
})
export class MyPlaceComponent implements OnInit {

  place: Place
  isLoading = false
  form: FormGroup
  imagePreview: string =""
  private mode = "create";
  private placeId: string;
  private user: any
  private userId: string
  private hasPlace: boolean
  isCitySelected: boolean

  constructor(
    public placesService: PlacesService,
    private authService: AuthService,
    public route: ActivatedRoute
    ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.userId = localStorage.getItem("userId")
    console.log(this.userId)
    this.form = new FormGroup({
      'title': new FormControl(null, {validators: [Validators.required,Validators.maxLength(50)]}),
      'description': new FormControl(null, {validators: [Validators.required]}),
      'image': new FormControl(null, {validators:[Validators.required], asyncValidators: [mimeType]})
    })
    this.authService.getUser(this.userId).subscribe((user) => {
      console.log(this.userId)
      console.log(user)
      if(user.user.city){
        this.isCitySelected  = true
      }else{
        this.isCitySelected  = false
      }
      this.hasPlace = user.hasPlace
      this.user = user
      console.log("burada")
      console.log(this.user)
      if(user.hasPlace){
        //console.log("yarek")
        
        this.placesService.getPlace(this.userId).subscribe(placeData => {
          this.isLoading = false;
          this.place = {id: placeData._id, title: placeData.title, description: placeData.description, 
            imagePath: placeData.imagePath,city:placeData.city, university:placeData.university};
          this.imagePreview = this.place.imagePath
          this.form.setValue({'title':this.place.title, image:this.place.imagePath,'description':this.place.description})
        },(err) => {
          console.log("zaaaadfafsdfg")
        });
      }
      this.isLoading = false
    })
    
    // this.route.paramMap.subscribe((paramMap: ParamMap) => {
    //   if (paramMap.has("placeId")) {
    //     this.mode = "edit";
    //     this.placeId = paramMap.get("placeId");
    //     console.log(this.placeId)
        
    //   } else {
    //     this.mode = "create";
    //     this.placeId = null;
    //   }
    // });
  }
  onSavePlace() {
    if (this.form.invalid) {
      console.log("OLMADII")
      return;
    }
    this.isLoading = true
    if (!this.hasPlace) {
      console.log("city")
      console.log(this.user.city)
      console.log("uni")
      console.log(this.user.university)
      this.placesService.addPlace(this.form.value.title, this.form.value.description,this.form.value.image,this.user.user.city,this.user.user.university);
    }else {
      console.log("zaqa")
      this.placesService.updatePlace(
        this.userId,
        this.form.value.title,
        this.form.value.description,
        this.form.value.image
      );
    }
    
    //this.placesService.addPlace(form.value.title, form.value.photo,form.value.description);
    this.form.reset();
  }

  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0]
    this.form.patchValue({'image': file})
    this.form.get('image').updateValueAndValidity()
    const reader = new FileReader()
    reader.onload = () => {
      this.imagePreview = (reader.result as string)
    }
    reader.readAsDataURL(file)
  }
  
  onDelete() {
    this.placesService.deletePlace(this.userId)
  }

}
