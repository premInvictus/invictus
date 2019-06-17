import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { UpdateConfirmationComponent } from './update-confirmation/update-confirmation.component';

@Component({
	selector: 'app-topicwise-update',
	templateUrl: './topicwise-update.component.html',
	styleUrls: ['./topicwise-update.component.css']
})
export class TopicwiseUpdateComponent implements OnInit {

	constructor(public dialog: MatDialog) {}

	openUpdateConfirmation() {
		const dialogRef = this.dialog.open(UpdateConfirmationComponent, {
			height: '400px',
			width: '550px'
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log(`Dialog result: ${result}`);
		});
	}

	ngOnInit() {
	}

}
