import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder} from '@angular/forms';
import { ckconfig } from '../../../questionbank/ckeditorconfig';
@Component({
	selector: 'app-mcqmr',
	templateUrl: './mcqmr.component.html',
	styleUrls: ['./mcqmr.component.css']
})
export class McqmrComponent implements OnInit {

	public ind_entry_form3: FormGroup;
	optionsArray: any[] = ['A', 'B', 'C', 'D'];
	ckeConfig: any;
	@ViewChild('question') question: any;
	@ViewChild('answerckeditor') answerckeditor: any;
	@ViewChild('explanationckeditor') explanationckeditor: any;


	constructor(private fbuild: FormBuilder) { }

	ngOnInit() {
		this.ckeConfig = ckconfig;
		this.buildForm();
	}
	buildForm(): void {
		this.ind_entry_form3 = this.fbuild.group({
			qus_name: '',
			qopt_options0: '',
			qopt_options1: '',
			qopt_options2: '',
			qopt_options3: '',
			qopt_answer0: '',
			qopt_answer1: '',
			qopt_answer2: '',
			qopt_answer3: '',
			qus_explanation: '',
			options: [],
			answer: []
		});
	}

}
