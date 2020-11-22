import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { PlacesService } from "../places/places.service"
import { Place } from "../places/place.model"
import { mimeType } from "./mime-type.validator"
import { AuthService } from '../auth/auth.service';
import {MatDialog} from '@angular/material/dialog';
import { ConfirmDeleteComponent } from './confirm-delete/confirm-delete.component';



@Component({
  selector: 'app-my-place',
  templateUrl: './my-place.component.html',
  styleUrls: ['./my-place.component.css']
})
export class MyPlaceComponent implements OnInit {

  place: Place
  isLoading = false
  form: FormGroup
  //imagePreview: string =""
  imagePreview: string[] = []
  private mode = "create";
  private placeId: string;
  private user: any
  private userId: string
  private hasPlace: boolean
  isCitySelected: boolean
  imageFiles: any[] =[]

  constructor(
    public placesService: PlacesService,
    private authService: AuthService,
    public route: ActivatedRoute,
    public dialog: MatDialog
    ) {}

  ngOnInit(): void {
    this.isLoading = true;
    //this.getImage()
    this.userId = localStorage.getItem("userId")
    this.form = new FormGroup({
      'title': new FormControl(null, {validators: [Validators.required,Validators.maxLength(50)]}),
      'description': new FormControl(null, {validators: [Validators.required]}),
      'image': new FormControl(null, {validators:[Validators.required], asyncValidators: [mimeType]}),
      //'images' : new FormControl(null)
    })
    this.authService.getUser(this.userId).subscribe((user) => {
      if(user.user.city){
        this.isCitySelected  = true
      }else{
        this.isCitySelected  = false
      }
      this.hasPlace = user.hasPlace
      this.user = user
      // console.log("burada")
      // console.log(this.user)
      if(user.hasPlace){
        //console.log("yarek")
        
        this.placesService.getPlace(this.userId).subscribe(placeData => {
          this.isLoading = false;
          this.place = {id: placeData._id, title: placeData.title, description: placeData.description, 
            imagePath: placeData.imagePath,city:placeData.city, university:placeData.university};
          this.imagePreview = this.place.imagePath
          // console.log("deneme")
          // console.log(this.imagePreview[0])

          for(const img of this.imagePreview){
            // const indx = img.lastIndexOf("\.")
            // let tmpText = img.slice(indx+1,img.length)
            // let myType
            // if(tmpText === "jpeg" || tmpText === "jpg"){
            //   myType = "image/jpg"
            // }else {
            //   myType = "image/png"
            // }
            // console.log("before img")
            // console.log(img)
            // console.log("after")
            // const aq = new File([""],img,{type:myType})
            // console.log(aq)
            // console.log(this.getImage(img))
            //this.imageFiles.push(aq)
            //this.imageFiles.push(this.getImage(img))
            let b
            fetch(img)
            .then(res => res.blob()) // Gets the response and returns it as a blob
            .then(blob => {
              // Here's where you get access to the blob
              // And you can use it for whatever you want
              // Like calling ref().put(blob)
              b = blob
              // Here, I use it to make an image appear on the page
              // console.log("blob")
              // console.log(blob)
              b.lastModified = Date.now();
              b.name = img;
              //return b
              // console.log("dosyammm")
              // console.log(b)
              this.imageFiles.push(b)
               
          })

          }

          this.form.setValue({'title':this.place.title, 'image':this.imagePreview[0],'description':this.place.description})
        },(err) => {
          console.log("zaaaadfafsdfg")
        });
      }
      this.isLoading = false
    })
    

  }
  onSavePlace() {
    if (this.form.invalid) {
      console.log("OLMADII")
      return;
    }
    this.isLoading = true
    if (!this.hasPlace) {
      this.placesService.addPlace(this.form.value.title, this.form.value.description,this.imageFiles,this.user.user.city,this.user.user.university);
    }else {
      this.placesService.updatePlace(
        this.userId,
        this.form.value.title,
        this.form.value.description,
        //this.form.value.image
        this.imageFiles
      );
    }
    
    //this.placesService.addPlace(form.value.title, form.value.photo,form.value.description);
    this.form.reset();
  }

  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0]
    if(!file){
      return
    }
    let aqq
    // const tmpFile = this.form.value.image
    // console.log(tmpFile)
    // tmpFile.push(file)
    //this.imageFiles
    console.log("onemli")
    console.log(file)
    console.log("invalid")
    console.log(this.form.get('image').invalid)
    this.form.patchValue({'image': file})
    console.log(this.form.get('image'))
    this.form.get('image').updateValueAndValidity({onlySelf: true})
    aqq = this.form.get('image')
    console.log(this.form.get('image'))
    console.log(this.form.get('image').valid)
    console.log(this.form.get('image').invalid)
    console.log(this.form.get('image').status)
    setTimeout(() =>{
      if(!this.form.get('image').valid){
        console.log("ONAYSIZZZZ")
        location.reload()
        return
      }
      this.imageFiles.push(file)
  
      const reader = new FileReader()
      reader.onload = () => {
        //this.imagePreview = (reader.result as string)
        this.imagePreview.push(reader.result as string)
      }
      reader.readAsDataURL(file)
    },1000)
    
  }
  
  onDelete() {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent)

    dialogRef.afterClosed().subscribe((res) => {
      if(res){
        this.placesService.deletePlace(this.userId)
      }
    })
    
  }

 

  
}
