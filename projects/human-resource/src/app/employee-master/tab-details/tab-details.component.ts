import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab-details',
  templateUrl: './tab-details.component.html',
  styleUrls: ['./tab-details.component.scss']
})
export class TabDetailsComponent implements OnInit {

  constructor() { }
  tabIndex = 1;
  tabDetailsArray: any[] = [
    { id: '1', name: 'Personal Details' },
    { id: '2', name: 'Personal Contact' },
    { id: '3', name: 'Salary Details' },
    { id: '4', name: 'Remarks' },
    { id: '5', name: 'Class & Section' },
    { id: '6', name: 'Documents' }
  ];

  ngOnInit() {
  }
  setTabValue($event) {
    if ($event === 0) {
      this.tabIndex = 0;
    } else if ($event === 1) {
      this.tabIndex = 1;
    } else if ($event === 2) {
      this.tabIndex = 2;
    } else if ($event === 3) {
      this.tabIndex = 3;
    } else if ($event === 4) {
      this.tabIndex = 4;
    } else if ($event === 5) {
      this.tabIndex = 5;
    }
  }

}
