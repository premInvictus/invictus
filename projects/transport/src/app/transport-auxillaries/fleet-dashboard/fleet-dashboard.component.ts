import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fleet-dashboard',
  templateUrl: './fleet-dashboard.component.html',
  styleUrls: ['./fleet-dashboard.component.scss']
})
export class FleetDashboardComponent implements OnInit {

  isLoading : boolean = true;
  loader_status = "Feature Under Construction";
  constructor() { }

  ngOnInit() {
  }

  openDialog(type){
    alert("feature is under development")
  }

}
