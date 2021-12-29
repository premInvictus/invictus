import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface PeriodicElement {
  srno: number; 
  feehead: string; 
  feedue: string; 
  concession: number; 
  adjustment: number; 
  netpay: string; 
  
}

const ELEMENT_DATA: PeriodicElement[] = [
  {srno: 1, feehead: 'One time', feedue: '13 Mar, 2019', concession: 30, adjustment: 12345, netpay: '15,963'},
  {srno: 1, feehead: 'One time', feedue: '13 Mar, 2019', concession: 30, adjustment: 12345, netpay: '15,963'},
  {srno: 1, feehead: 'One time', feedue: '13 Mar, 2019', concession: 30, adjustment: 12345, netpay: '15,963'},
  {srno: 1, feehead: 'One time', feedue: '13 Mar, 2019', concession: 30, adjustment: 12345, netpay: '15,963'},
  {srno: 1, feehead: 'One time', feedue: '13 Mar, 2019', concession: 30, adjustment: 12345, netpay: '15,963'},
  {srno: 1, feehead: 'One time', feedue: '13 Mar, 2019', concession: 30, adjustment: 12345, netpay: '15,963'},
  
];

@Component({
	selector: 'app-invoice-creation-popup',
	templateUrl: './invoice-creation-popup.component.html',
	styleUrls: ['./invoice-creation-popup.component.scss']
})
export class InvoiceCreationPopupComponent implements OnInit {

  displayedColumns: string[] = [ 'srno', 'feehead', 'feedue', 'concession', 'adjustment', 'netpay'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  

	constructor(public dialogRef: MatDialogRef<InvoiceCreationPopupComponent>) { }

	ngOnInit() {
	}

	closemodal(): void {
		this.dialogRef.close();
	}

}
