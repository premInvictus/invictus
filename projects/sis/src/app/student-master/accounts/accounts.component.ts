import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
	selector: 'app-accounts',
	templateUrl: './accounts.component.html',
	styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {

	Accounts_Form: FormGroup;
	constructor(
		private fbuild: FormBuilder
	) { }

	ngOnInit() {
		this.buildForm();
	}
	buildForm() {
		this.Accounts_Form = this.fbuild.group({
			uad_id: '',
			uad_concession_category: '',
			uad_fee_cycle: '',
			ts_id: '',
			tr_id: '',
			tsp_tr_id: '',
			tsp_stop: ''
		});
	}

}
