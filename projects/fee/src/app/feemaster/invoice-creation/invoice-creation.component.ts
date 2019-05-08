import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-invoice-creation',
	templateUrl: './invoice-creation.component.html',
	styleUrls: ['./invoice-creation.component.scss']
})
export class InvoiceCreationComponent implements OnInit {
	invoiceBulk = true;
	invoiceIndividual = false;

	constructor() { }

	ngOnInit() {
	}

	toggleDiv() {
		console.log('clicked');
		if (this.invoiceBulk === true) {
			this.invoiceBulk = false;
			this.invoiceIndividual = true;
		} else {
			this.invoiceBulk = true;
			this.invoiceIndividual = false;
		}
	}

}
