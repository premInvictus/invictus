import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SisService, CommonAPIService } from '../../_services/index';
import { saveAs } from 'file-saver';
@Component({
	selector: 'app-income-and-expenditure-updates',
	templateUrl: './income-and-expenditure.component.html',
	styleUrls: ['./income-and-expenditure.component.scss']
})
export class IncomeAndExpenditureComponent implements OnInit {
	ngOnInit(){

	}
}
