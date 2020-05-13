import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SisService, CommonAPIService } from '../../_services/index';
import { saveAs } from 'file-saver';
@Component({
	selector: 'app-statutory-fillings',
	templateUrl: './statutory-fillings.component.html',
	styleUrls: ['./statutory-fillings.component.scss']
})
export class StatutoryFillingsComponent implements OnInit {
	constructor(
		private sisService: SisService,
		private commonAPIService: CommonAPIService
	) { }

	ngOnInit() {
	}
}
