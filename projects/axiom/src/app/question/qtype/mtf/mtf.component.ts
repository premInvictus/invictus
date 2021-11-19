import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ckconfig } from '../../../questionbank/ckeditorconfig';

@Component({
	selector: 'app-mtf',
	templateUrl: './mtf.component.html',
	styleUrls: ['./mtf.component.css']
})
export class MtfComponent implements OnInit {
	ckeConfig: any;
	@ViewChild('question') question: any;
	@ViewChild('optiona') optiona: any;
	@ViewChild('optionb') optionb: any;
	@ViewChild('optionq') optionq: any;
	@ViewChild('optionc') optionc: any;
	@ViewChild('optionr') optionr: any;
	@ViewChild('optiond') optiond: any;
	@ViewChild('optiont') optiont: any;
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
			optiona: '',
			optionp: '',
			apqrs1: '',
			optionb: '',
			optionq: '',
			bpqrs1: '',
			optionc: '',
			optionr: '',
			cpqrs1: '',
			optiond: '',
			optiont: '',
			dpqrs1: '',
			qus_explanation: '',
			options: [],
			options_match: [],
			answer: []
		});
	}

}
