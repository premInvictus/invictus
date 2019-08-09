import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-assignment',
	templateUrl: './assignment.component.html',
	styleUrls: ['./assignment.component.css']
})
export class AssignmentComponent implements OnInit {

	isLinear = true;
	firstFormGroup = null;
	secondFormGroup = null;
	constructor() { }

	ngOnInit() {
	}



}
