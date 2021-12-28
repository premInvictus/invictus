import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-device-mapping',
  templateUrl: './device-mapping.component.html',
  styleUrls: ['./device-mapping.component.scss']
})
export class DeviceMappingComponent implements OnInit {

  isLoading : boolean = true;
  loader_status = "Feature Under Construction";
  constructor() { }

  ngOnInit() {
  }

  openDialog(type){
    alert("feature is under development")
  }
}
