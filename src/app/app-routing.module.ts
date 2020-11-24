import { NgModule } from "@angular/core";
import { Routes,RouterModule } from "@angular/router";
import { AuthGuard } from "./auth/auth.guard";
import { MyAccountComponent } from "./my-account/my-account.component";
import { MyPlaceComponent } from "./my-place/my-place.component";
import { PlacesComponent } from "./places/places.component";
import { PlaceComponent } from "./places/place/place.component";

const appRoutes : Routes = [
    {path:'', component: PlacesComponent,pathMatch:"full"},
    {path:'my-account', component: MyAccountComponent, canActivate: [AuthGuard]},
    {path:'my-place', component: MyPlaceComponent , canActivate: [AuthGuard], pathMatch: "full"},
    {path:'my-place/:placeId', component: MyPlaceComponent , canActivate: [AuthGuard], pathMatch: "full"},
    {path:'place/:placeId', component: PlaceComponent , canActivate: [AuthGuard], pathMatch: "full"},
    //{path:'edit/:placeId', component: MyPlaceComponent },
    {path:'places', component: PlacesComponent, canActivate: [AuthGuard]},
    //{path:'**', redirectTo:""}
]

@NgModule({
    imports:[RouterModule.forRoot(appRoutes)],
    exports:[RouterModule],
    providers:[AuthGuard]
})

export class AppRoutingModule{

}