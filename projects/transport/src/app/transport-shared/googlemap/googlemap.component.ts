import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-googlemap',
  templateUrl: './googlemap.component.html',
  styleUrls: ['./googlemap.component.scss']
})
export class GooglemapComponent implements OnInit {

  @Input() value: any;
  lat: number;
  long: number;
  zoom = 7;

  markers = [];
  // markers= [
  //   {
  // 	  lat: 51.673858,
  // 	  lng: 7.815982,
  // 	  label: 'A',
  // 	  draggable: true
  //   },
  //   {
  // 	  lat: 51.373858,
  // 	  lng: 7.215982,
  // 	  label: 'B',
  // 	  draggable: false
  //   },
  //   {
  // 	  lat: 51.723858,
  // 	  lng: 7.895982,
  // 	  label: 'C',
  // 	  draggable: true
  //   }
  // ]
  constructor() { }

  ngOnInit() {
    // console.log('value', this.value);
    // console.log('float lat value', parseFloat(this.value.lat).toFixed(6));
    // console.log('Number lat value', Number(this.value.lat));
    this.lat = Number(this.value.lat);
    this.long = Number(this.value.long);
    this.markers = this.value.markers
  }

}
