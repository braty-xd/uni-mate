import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Place } from "./place.model"
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
import {Router} from "@angular/router"

@Injectable({providedIn: "root"})
export class PlacesService {

    private places: Place[] = []
    private placesUpdated =  new Subject<{places:Place[],maxPlaces:number}>()

    constructor(private http: HttpClient, private router: Router) {}

    getPlaces(placesPerPage: number, currentPage: number,userCity:string) {
      console.log("artik")
      const queryParams = `?pagesize=${placesPerPage}&page=${currentPage}&usercity=${userCity}`
        this.http
          .get<{ message: string; places: any; maxPlaces: number }>(
            "http://localhost:3000/api/places" + queryParams
          )
          .pipe(map((placeData) => {
            console.log("degisik")
            return { places: placeData.places.map(place => {
              return {
                title: place.title,
                description: place.description,
                id: place._id,
                imagePath: place.imagePath,
                owner: place.owner,
                city: place.city,
                university: place.university
              };
            }), maxPlaces: placeData.maxPlaces};
          }))
          .subscribe(transformedPlaceData => {
            this.places = transformedPlaceData.places;
            console.log("AAAAAAAAAAAAAAAAAAAA")
            console.log(this.places)
            this.placesUpdated.next({places:[...this.places],maxPlaces:transformedPlaceData.maxPlaces});
          });
      }

      getPlaceUpdateListener() {
        return this.placesUpdated.asObservable();
      }

      getPlace(id: string) {
        return this.http.get<{ _id: string; title: string; photo: string; description: string; 
          imagePath: string;owner: string; city: string; university: string }>(
          "http://localhost:3000/api/places/" + id
        );
      }

      addPlace(title: string, description: string, image: File,city: string, uni: string) {
        const placeData = new FormData()
        placeData.append("title", title)
        placeData.append("description", description)
        placeData.append("city", city)
        placeData.append("uni", uni)
        placeData.append("image", image, title)
        //const place: Place = { id: null, title: title, photo: photo, description: description };
        this.http
          .post<{ message: string, place: Place }>("http://localhost:3000/api/places", placeData)
          .subscribe(responseData => {
            this.router.navigate(["/"])
          });
      }

      updatePlace(id: string, title: string, description: string, image: File | string) {
        //const place: Place = { id: id, title: title,description: description, imagePath: null };
        let placeData;
        if(typeof(image) === 'object'){
          placeData = new FormData()
          placeData.append("id",id)
          placeData.append("title",title)
          placeData.append("description",description)
          placeData.append("image",image,title)
        }else{  
          console.log("else")
          
          placeData= {id: id, title: title, description: description, imagePath: image}
          console.log(placeData)
        }
        this.http
          .put("http://localhost:3000/api/places/" + id, placeData)
          .subscribe(response => {
            // const updatedPlaces = [...this.places];
            // const oldPlaceIndex = updatedPlaces.findIndex(p => p.id === id);
            // const place: Place = {id: id, title: title, description: description, imagePath: ""}
            // updatedPlaces[oldPlaceIndex] = place;
            // this.places = updatedPlaces;
            // this.placesUpdated.next([...this.places]);
            console.log(response)
            this.router.navigate(["/"]);
          }, err => {
            console.log(err)
          });
      }

      deletePlace(id: string) {
        this.http.delete("http://localhost:3000/api/places/" + id).subscribe(res => {
          this.http.put("http://localhost:3000/api/users/" + id,{hasPlace: false}).subscribe(res =>{
            this.router.navigate(["/"])
          })
          
        })
      }
}