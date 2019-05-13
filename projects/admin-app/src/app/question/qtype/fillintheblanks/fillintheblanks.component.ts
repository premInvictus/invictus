import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ckconfig } from '../../../questionbank/ckeditorconfig';
import { KatexOptions } from 'ng-katex';
@Component({
	selector: 'app-fillintheblanks',
	templateUrl: './fillintheblanks.component.html',
	styleUrls: ['./fillintheblanks.component.css']
})

export class FillintheblanksComponent implements OnInit {

	options: KatexOptions = {
		displayMode: true,
	};


	public ind_entry_form3: FormGroup;

	name = 'ng2-ckeditor';
	ckeConfig: any;
	mycontent: string;
	log = '';
	@ViewChild('question') ckeditor: any;
	@ViewChild('answerckeditor') answerckeditor: any;
	@ViewChild('explanationckeditor') explanationckeditor: any;

	constructor(
		private fbuild: FormBuilder,
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


