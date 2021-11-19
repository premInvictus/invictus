import { Component, OnInit, ChangeDetectorRef, AfterViewChecked, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ckconfig } from '../../../questionbank/ckeditorconfig';

@Component({
	selector: 'app-matrix',
	templateUrl: './matrix.component.html',
	styleUrls: ['./matrix.component.css']
})
export class MatrixComponent implements OnInit, AfterViewChecked {
	public ind_entry_form3: FormGroup;
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
	constructor(
		private fbuild: FormBuilder,
		private changeDetector: ChangeDetectorRef
	) { }

	ngOnInit() {
		this.ckeConfig = ckconfig;
		this.buildForm();
	}

	ngAfterViewChecked() {
		this.changeDetector.detectChanges();
	}

	buildForm() {
		this.ind_entry_form3 = this.fbuild.group({
			qus_name: '',
			optiona: '',
			optionp: '',
			apqrs1: '',
			apqrs2: '',
			apqrs3: '',
			apqrs4: '',
			optionb: '',
			optionq: '',
			bpqrs1: '',
			bpqrs2: '',
			bpqrs3: '',
			bpqrs4: '',
			optionc: '',
			optionr: '',
			cpqrs1: '',
			cpqrs2: '',
			cpqrs3: '',
			cpqrs4: '',
			optiond: '',
			optiont: '',
			dpqrs1: '',
			dpqrs2: '',
			dpqrs3: '',
			dpqrs4: '',
			qus_explanation: '',
			options: [],
			options_match: [],
			answer: []
		});
	}
}
