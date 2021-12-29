import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ckconfig } from '../../../questionbank/ckeditorconfig';

@Component({
	selector: 'app-veryshortanswer',
	templateUrl: './veryshortanswer.component.html',
	styleUrls: ['./veryshortanswer.component.css']
})

export class VeryshortanswerComponent implements OnInit {
	ckeConfig: any;
	@ViewChild('question') question: any;
	@ViewChild('answerckeditor') answerckeditor: any;
	@ViewChild('explanationckeditor') explanationckeditor: any;
	public ind_entry_form3: FormGroup;

	constructor(
		private fbuild: FormBuilder
	) { }

	ngOnInit() {
		this.ckeConfig = ckconfig;
		this.buildForm();
	}

	buildForm() {
		this.ind_entry_form3 = this.fbuild.group({
			qus_name: '',
			qopt_answer: '',
			qus_explanation: '',
			answer: ''
		});
	}
}
