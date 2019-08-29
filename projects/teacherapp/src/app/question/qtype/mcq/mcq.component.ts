import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ckconfig } from '../../../questionbank/ckeditorconfig';
@Component({
	selector: 'app-mcq',
	templateUrl: './mcq.component.html',
	styleUrls: ['./mcq.component.css']
})
export class McqComponent implements OnInit {
	public ind_entry_form3: FormGroup;
	optionsArray: any[] = ['A', 'B', 'C', 'D'];
	a: boolean;
	b: boolean;
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
		this.a = true;
		this.b = false;
	}

	buildForm(): void {
		this.ind_entry_form3 = this.fbuild.group({
			qus_name: '',
			qopt_options0: '',
			qopt_options1: '',
			qopt_options2: '',
			qopt_options3: '',
			qopt_answer: '',
			qus_explanation: '',
			options: [],
			answer: []
		});
	}
	enableForola() {
		this.a = false;
		this.b = true;
	}
}
