import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab-details',
  templateUrl: './tab-details.component.html',
  styleUrls: ['./tab-details.component.scss']
})
export class TabDetailsComponent implements OnInit {

  constructor() { }
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

}
