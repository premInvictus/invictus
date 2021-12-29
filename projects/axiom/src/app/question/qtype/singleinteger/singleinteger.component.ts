import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ckconfig } from '../../../questionbank/ckeditorconfig';

@Component({
	selector: 'app-singleinteger',
	templateUrl: './singleinteger.component.html',
	styleUrls: ['./singleinteger.component.css']
})
export class SingleintegerComponent implements OnInit {
	singleIntegerArray: any[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	public ind_entry_form3: FormGroup;
	ckeConfig: any;
	digitValue: any;
	@ViewChild('question') question: any;
	@ViewChild('explanationckeditor') explanationckeditor: any;
	constructor(
		private fbuild: FormBuilder
	) { }

	ngOnInit() {
		this.ckeConfig = ckconfig;
		this.buildForm();
		this.digitValue = '-';
	}

	buildForm(): void {
		this.ind_entry_form3 = this.fbuild.group({
			qus_name: '',
			qopt_answer: '',
			qus_explanation: '',
			answer: ''
		});
	}
	getValue($event) {
		this.digitValue = $event.value;
	}

}
