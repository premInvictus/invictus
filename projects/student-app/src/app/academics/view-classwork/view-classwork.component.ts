import { Component, OnInit } from '@angular/core';
import { ErpCommonService, CommonAPIService } from 'src/app/_services/index';
import { QelementService } from 'projects/axiom/src/app/questionbank/service/qelement.service';

@Component({
	selector: 'app-view-classwork',
	templateUrl: './view-classwork.component.html',
	styleUrls: ['./view-classwork.component.css']
})
export class ViewClassworkComponent implements OnInit {
	periodSup = ['st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th'];
	noDataFlag = true;
	curDate = new Date();
	dataArr: any[] = [];
	classworkArray: any[] = [];
	userDetail: any;
	currentUser: any;

	constructor(
		private erpCommonService: ErpCommonService,
		private commonAPIService: CommonAPIService,
		private qelementService: QelementService
	) { }

	ngOnInit() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.qelementService.getUser({ login_id: this.currentUser.login_id, role_id: '4' }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.userDetail = result.data[0];
					console.log('userDetail', this.userDetail);
					this.getClasswork();
				}
			});
	}
	getClassworkForDate(datestr, cwarray) {
		const tempcw: any[] = [];
		if (cwarray.length > 0) {
			cwarray.forEach(item => {
				if (this.commonAPIService.dateConvertion(item.cw_entry_date) === datestr) {
					tempcw.push(item);
				}
			});
		}
		tempcw.sort((a, b) => {
			if (Number(a.cw_period_id) > Number(b.cw_period_id)) {
				return 1;
			} else if (Number(a.cw_period_id) < Number(b.cw_period_id)) {
				return -1;
			} else {
				return 0;
			}
		});
		return tempcw;
	}
	getClasswork() {
		if (true) {
			this.classworkArray = [];
			const param: any = {};
			param.from = this.commonAPIService.dateConvertion(new Date());
			param.to = this.commonAPIService.dateConvertion(new Date());
			param.class_id = this.userDetail.au_class_id;
			param.sec_id = this.userDetail.au_sec_id;
			this.erpCommonService.getClasswork(param).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.noDataFlag = false;
					console.log(result.data);
					this.dataArr = result.data;
					const tempcw = result.data;
					const dateSet = new Set();
					if (tempcw.length > 0) {
						tempcw.forEach(element => {
							dateSet.add(this.commonAPIService.dateConvertion(element.cw_entry_date));
							element.csName = element.sec_name ? element.class_name + '-' + element.sec_name : element.class_name;
						});
					}
					console.log(dateSet);
					dateSet.forEach(item => {
						this.classworkArray.push({
							cw_entry_date: item,
							cw_array: this.getClassworkForDate(item, tempcw)
						});
					});
					console.log(this.classworkArray);

				} else {
					this.noDataFlag = true;
				}
			});
		} else {
		}
	}

}
