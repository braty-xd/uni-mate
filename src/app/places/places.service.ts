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

    getPlaces(placesPerPage: number, currentPage: number,userCity:string,
      orderByUni: string = null, orderBySex: string = null, maxRent: string = null) {
      
      
      let queryParams = `?pagesize=${placesPerPage}&page=${currentPage}&usercity=${userCity}`
      if(orderByUni){queryParams+=`&uni=${orderByUni}`}
      if(orderBySex){queryParams+=`&sex=${orderBySex}`}
      if(maxRent){queryParams+=`&maxrent=${maxRent}`}
      console.log(queryParams)
        this.http
          .get<{ message: string; places: any; maxPlaces: number }>(
            "http://localhost:3000/api/places" + queryParams
          )
          .pipe(map((placeData) => {
            return { places: placeData.places.map(place => {
              return {
                title: place.title,
                description: place.description,
                id: place._id,
                imagePath: place.imagePath,
                owner: place.owner,
                city: place.city,
                university: place.university,
                rent: place.rent,
                ownerSex: place.ownerSex
              };
            }), maxPlaces: placeData.maxPlaces};
          }))
          .subscribe(transformedPlaceData => {
            this.places = transformedPlaceData.places;
            this.placesUpdated.next({places:[...this.places],maxPlaces:transformedPlaceData.maxPlaces});
          });
      }

      getPlaceUpdateListener() {
        return this.placesUpdated.asObservable();
      }

      getPlace(id: string) {
        return this.http.get<{ _id: string; title: string;  description: string; 
          imagePath: string[];owner: string; city: string; university: string; rent: string; ownerSex: string }>(
          "http://localhost:3000/api/places/" + id
        );
      }

      addPlace(title: string, description: string, image: File[],city: string, uni: string,rent: string,ownerSex: string) {
        const placeData = new FormData()
        placeData.append("title", title)
        placeData.append("description", description)
        placeData.append("city", city)
        placeData.append("uni", uni)
        placeData.append("rent",rent)
        placeData.append("ownerSex",ownerSex)
        //placeData.append("image", image, title)
        let i=0
        for (const img of image){
          placeData.append("image",img,`${title}_${i}`)
          i++;
        }
        //placeData.append("imageNumber", `${i}`)


        this.http
          .post<{ message: string, place: Place }>("http://localhost:3000/api/places", placeData)
          .subscribe(responseData => {
            this.router.navigate(["/"])
          });
      }

      updateUniOfPlace(id: string, uni: string) {
        this.http.put("http://localhost:3000/api/places/" + id, {university: uni}).subscribe(response => {
          // const updatedPlaces = [...this.places];
          // const oldPlaceIndex = updatedPlaces.findIndex(p => p.id === id);
          // const place: Place = {id: id, title: title, description: description, imagePath: ""}
          // updatedPlaces[oldPlaceIndex] = place;
          // this.places = updatedPlaces;
          // this.placesUpdated.next([...this.places]);
          this.router.navigate(["/"]);
        }, err => {
          console.log(err)
        });
      }

      updateSexOfPlaceOwner(id: string, sex: string) {
        console.log("myid")
        console.log(id)
        this.http.put("http://localhost:3000/api/places/" + id, {ownerSex: sex}).subscribe(response => {
          // const updatedPlaces = [...this.places];
          // const oldPlaceIndex = updatedPlaces.findIndex(p => p.id === id);
          // const place: Place = {id: id, title: title, description: description, imagePath: ""}
          // updatedPlaces[oldPlaceIndex] = place;
          // this.places = updatedPlaces;
          // this.placesUpdated.next([...this.places]);
          this.router.navigate(["/"]);
        }, err => {
          console.log(err)
        });
      }
      updatePlace(id: string, title: string, description: string, image: File[] | string[]
        ,rent: string,ownerSex: string) {
        //const place: Place = { id: id, title: title,description: description, imagePath: null };
        let placeData;
        console.log(typeof(image))
        console.log(image)
        
        if(typeof(image[(image.length - 1)]) === 'object'){
          placeData = new FormData()
          placeData.append("id",id)
          placeData.append("title",title)
          placeData.append("description",description)
          placeData.append("rent",rent)
          placeData.append("ownerSex",ownerSex)
          //placeData.append("image",image,title)
          let i = 0
          for (const img of image){
            console.log(typeof(img))
            placeData.append("image",img,`${title}_${i}`)
            i++
          }
        }else{  

          
          placeData= {id: id, title: title, description: description, imagePath: image,rent: rent, ownerSex: ownerSex}

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