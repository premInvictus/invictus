import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { SmartService, CommonAPIService } from '../../_services';

@Component({
	selector: 'app-class-wise',
	templateUrl: './class-wise.component.html',
	styleUrls: ['./class-wise.component.css']
})
export class ClassWiseComponent implements OnInit, OnChanges {

	@Input() param;
	classworkArray: any[] = [];
	periodSup = ['', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th'];
	noDataFlag = true;
	isTeacher = false;
	constructor(
		private smartService: SmartService,
		private commonAPIService: CommonAPIService
	) { }

	ngOnInit() {
		console.log('class-wise');
	}
	ngOnChanges() {
		this.getClasswork();
	}
	getClassworkForDate(datestr, cwarray) {
		const tempcw: any[] = [];
		if (cwarray.length > 0) {
			cwarray.forEach(item => {
				if (item.entry_date === datestr) {
					tempcw.push(item);
				}
			});
		}
		return tempcw;
	}

	getClasswork() {
		if (this.param.class_id && this.param.sec_id) {
			this.classworkArray = [];
			const param: any = {};
			if (this.param.class_id) {
				param.class_id = this.param.class_id;
			}
			if (this.param.sec_id) {
				param.sec_id = this.param.sec_id;
			}
			if (this.param.from) {
				param.from = this.commonAPIService.dateConvertion(this.param.from);
			}
			if (this.param.to) {
				param.to = this.commonAPIService.dateConvertion(this.param.to);
			}
			this.smartService.getClasswork(param).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.noDataFlag = false;
					// console.log(result.data);
					const tempcw = result.data;
					const dateSet = new Set();
					if (tempcw.length > 0) {
						tempcw.forEach(element => {
							dateSet.add(element.entry_date);
						});
					}
					console.log('dateSet', dateSet);
					dateSet.forEach(item => {
						this.classworkArray.push({
							cw_entry_date: item,
							cw_array: this.getClassworkForDate(item, tempcw)
						});
					});
					console.log('class', this.classworkArray);

				} else {
					this.noDataFlag = true;
					this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
				}
			});
		}
	}

}
