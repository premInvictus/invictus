import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ckconfig } from '../../../questionbank/ckeditorconfig';

@Component({
	selector: 'app-shortanswer',
	templateUrl: './shortanswer.component.html',
	styleUrls: ['./shortanswer.component.css']
})

export class ShortanswerComponent implements OnInit {

	public ind_entry_form3: FormGroup;
	ckeConfig: any;
	@ViewChild('question') question: any;
	@ViewChild('answerckeditor') answerckeditor: any;
	@ViewChild('explanationckeditor') explanationckeditor: any;
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
