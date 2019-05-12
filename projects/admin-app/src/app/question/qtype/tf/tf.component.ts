import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ckconfig } from '../../../questionbank/ckeditorconfig';

@Component({
	selector: 'app-tf',
	templateUrl: './tf.component.html',
	styleUrls: ['./tf.component.css']
})
export class TfComponent implements OnInit {

	optionsArray: any[] = ['True', 'False'];
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
	}

	buildForm(): void {
		this.ind_entry_form3 = this.fbuild.group({
			qus_name: '',
			qopt_options0: '',
			qopt_options1: '',
			qopt_answer: '',
			qus_explanation: '',
			options: [],
			answer: []
		});
	}
}

