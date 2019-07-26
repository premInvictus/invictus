import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SisService, AxiomService, CommonAPIService, SmartService } from '../../../_services';

@Component({
	selector: 'app-add-scheduler',
	templateUrl: './add-scheduler.component.html',
	styleUrls: ['./add-scheduler.component.css']
})
export class AddSchedulerComponent implements OnInit {

	ckeConfig: any = {};
	toMin = new Date();
	schedulerform: FormGroup;
	classArray: any[] = [];
	ecArray: any[] = [];
	periodsArray = [];
	constructor(
		public dialogRef: MatDialogRef<AddSchedulerComponent>,
		@Inject(MAT_DIALOG_DATA) public data,
		private sisService: SisService,
		private commonAPIService: CommonAPIService,
		private axiomService: AxiomService,
		private smartService: SmartService,
		private fb: FormBuilder
	) { }

	ngOnInit() {
		console.log(this.data);
		this.buildForm();
		this.ckeConfig = {
			allowedContent: true,
			pasteFromWordRemoveFontStyles: false,
			contentsCss: ['https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css'],
			disallowedContent: 'm:omathpara',
			height: '170',
			width: '100%',
			// tslint:disable-next-line:max-line-length
			extraPlugins: '',
			scayt_multiLanguageMod: true,
			toolbar: [
				// tslint:disable-next-line:max-line-length
				['Font', 'FontSize', 'Bold', 'Italic', 'Underline', 'Strikethrough', 'Image', 'Table', 'Templates']
			],
			removeDialogTabs: 'image:advanced;image:Link'
		};
		this.getSchedulerEventCategory();
		this.getClass();
		this.getMaxPeriod();
		if (this.data && this.data.schedulerDetails) {
			this.setSchedulerform(this.data.schedulerDetails);
		}
	}
	buildForm() {
		this.schedulerform = this.fb.group({
			sc_title: '',
			sc_from: '',
			sc_to: '',
			sc_partial_day_event: '',
			sc_period_effect: '',
			sc_event_category: '',
			sc_class: '',
			sc_sec: '',
			sc_description: ''
		});
	}
	getMaxPeriod() {
		this.smartService.getMaxPeriod().subscribe((result: any) => {
			if (result && result.status === 'ok') {
				for (let i = 1; i <= Number(result.data.no_of_period); i++) {
					this.periodsArray.push(i);
				}
			}
		});
	}
	setSchedulerform(value) {
		this.schedulerform.patchValue({
			sc_title: value.sc_title,
			sc_from: value.sc_from,
			sc_to: value.sc_to,
			sc_partial_day_event: value.sc_partial_day_event === '1' ? true : false,
			sc_period_effect: value.sc_period_effect ? value.sc_period_effect.map(item => Number(item)) : '',
			sc_event_category: value.sc_event_category,
			sc_class: value.sc_class,
			sc_sec: value.sc_sec,
			sc_description: value.sc_description
		});
		console.log(this.schedulerform.value);
	}
	setMinTo(event) {
		this.toMin = event.value;
	}
	closeDialog() {
		this.dialogRef.close();
	}
	reset() {
		this.schedulerform.reset();
	}
	resetPeriod(event) {
		if (!event.checked) {
			this.schedulerform.patchValue({
				sc_period_effect: ''
			});
		}
	}
	resetClass(event) {
		if (event.value !== '3') {
			this.schedulerform.patchValue({
				sc_class: ''
			});
		}
	}
	getClass() {
		this.classArray = [];
		this.sisService.getClass({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.classArray = result.data;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}

	getSchedulerEventCategory() {
		this.ecArray = [];
		this.smartService.getSchedulerEventCategory().subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.ecArray = result.data;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}

	submit() {
		console.log(this.schedulerform);
		if (this.schedulerform.valid) {
			this.schedulerform.value.sc_from = this.commonAPIService.dateConvertion(this.schedulerform.value.sc_from);
			this.schedulerform.value.sc_to = this.commonAPIService.dateConvertion(this.schedulerform.value.sc_to);
			this.schedulerform.value.sc_partial_day_event = this.schedulerform.value.sc_partial_day_event ? '1' : '0';
			// const param: any = this.schedulerform.value;
			if (this.data.schedulerDetails && this.data.schedulerDetails.sc_id) {
				this.schedulerform.value.sc_id = this.data.schedulerDetails.sc_id;
			}
			this.smartService.insertScheduler(this.schedulerform.value).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
					this.reset();
					this.dialogRef.close({ reloadScheduler: true });
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
					this.dialogRef.close({ reloadScheduler: false });
				}
			});
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please fill all required fields', 'error');
		}
	}

}
