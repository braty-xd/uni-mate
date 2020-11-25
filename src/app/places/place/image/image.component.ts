import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {

  constructor(private route: ActivatedRoute, public router: Router
    ,private _location: Location) { }

  myImg: string
  isLoading: boolean = false

  ngOnInit(): void {
    this.isLoading = true
    this.myImg = this.route.snapshot.url[1].path
    console.log("zaqaa")
    console.log(this.myImg)
    this.isLoading = false

  }

  onBackClick() {
    this._location.back()
  }

}
