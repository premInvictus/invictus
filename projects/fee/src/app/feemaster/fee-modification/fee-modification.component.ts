import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

export interface PeriodicElement {
	srno: number;
	invoiceno: number;
	invoicedate: string;
	feeperiod: string;
	feedue: string;
	remark: string;
	status: any;
	action: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
	{
		srno: 1,  invoiceno: 12345, invoicedate: '23 March 2019',
		 feeperiod: 'The currency', feedue: 'The currency', remark: 'NA', status: 'Unpaid', action: ''
	},

];

@Component({
	selector: 'app-fee-modification',
	templateUrl: './fee-modification.component.html',
	styleUrls: ['./fee-modification.component.scss']
})
export class FeeModificationComponent implements OnInit {

	displayedColumns: string[] =
		['select', 'srno', 'invoiceno', 'invoicedate', 'feeperiod', 'feedue', 'remark', 'status', 'action'];
	dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
	selection = new SelectionModel<PeriodicElement>(true, []);

	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}

	masterToggle() {
		this.isAllSelected() ?
			this.selection.clear() :
			this.dataSource.data.forEach(row => this.selection.select(row));
	}

	checkboxLabel(row?: PeriodicElement): string {
		if (!row) {
			return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
		}
		return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.srno + 1}`;
	}


	constructor() { }

	ngOnInit() {
	}

}
