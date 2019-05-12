import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ckconfig } from '../../../questionbank/ckeditorconfig';

@Component({
	selector: 'app-doubleinteger',
	templateUrl: './doubleinteger.component.html',
	styleUrls: ['./doubleinteger.component.css']
})
export class DoubleintegerComponent implements OnInit {
	doubleIntegerArray1: any[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	doubleIntegerArray2: any[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	upperRowValue: any;
	lowerRowValue: any;
	public ind_entry_form3: FormGroup;
	ckeConfig: any;
	@ViewChild('question') question: any;
	@ViewChild('explanationckeditor') explanationckeditor: any;
	constructor(
		private fbuild: FormBuilder
	) { }

	ngOnInit() {
		this.ckeConfig = ckconfig;
		this.buildForm();
		this.upperRowValue = '-';
		this.lowerRowValue = '-';
	}

	buildForm(): void {
		this.ind_entry_form3 = this.fbuild.group({
			qus_name: '',
			qopt_answer1: '',
			qopt_answer2: '',
			qus_explanation: '',
			answer: ''
		});
	}

	getUpperRowValue($event) {
	this.upperRowValue = $event.value;
	}

	getLowerRowValue($event) {
		this.lowerRowValue = $event.value;
		}

}
