import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';

@Component({
	selector: 'app-book-detail',
	templateUrl: './book-detail.component.html',
	styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
	constructor(private dialog: MatDialog) { }
	@Input() bookData;
	ngOnInit() {
		console.log(this.bookData);
	}

	bookReserveRequest($event) {

	}
	

}
