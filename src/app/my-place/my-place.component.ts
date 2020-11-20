import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { PlacesService } from "../places/places.service"
import { Place } from "../places/place.model"
import { mimeType } from "./mime-type.validator"


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

  constructor(
    public placesService: PlacesService,
    public route: ActivatedRoute
    ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      'title': new FormControl(null, {validators: [Validators.required]}),
      'description': new FormControl(null, {validators: [Validators.required]}),
      'image': new FormControl(null, {validators:[Validators.required], asyncValidators: [mimeType]})
    })
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("placeId")) {
        this.mode = "edit";
        this.placeId = paramMap.get("placeId");
        this.isLoading = true;
        this.placesService.getPlace(this.placeId).subscribe(placeData => {
          this.isLoading = false;
          this.place = {id: placeData._id, title: placeData.title, description: placeData.description, imagePath: placeData.imagePath};
          this.form.setValue({'title':this.place.title, image:this.place.imagePath,'description':this.place.description})
        });
      } else {
        this.mode = "create";
        this.placeId = null;
      }
    });
  }
  onSavePlace() {
    if (this.form.invalid) {
      console.log("OLMADII")
      return;
    }
    this.isLoading = true
    if (this.mode === "create") {
      this.placesService.addPlace(this.form.value.title, this.form.value.description,this.form.value.image);
    }else {
      this.placesService.updatePlace(
        this.placeId,
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
  

}
