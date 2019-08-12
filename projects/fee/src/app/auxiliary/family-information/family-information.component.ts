import { Component, OnInit } from '@angular/core';
import { FeeService, CommonAPIService, SisService } from '../../_services';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
	selector: 'app-family-information',
	templateUrl: './family-information.component.html',
	styleUrls: ['./family-information.component.css']
})
export class FamilyInformationComponent implements OnInit {
	familyOutstandingArr: any[] = [];
	childDataArr: any[] = [];
	constructor(
		private route: ActivatedRoute,
		private router: Router,
		public feeService: FeeService,
		public sisService: SisService,
		private common: CommonAPIService, ) { }

	ngOnInit() {

		const familyNumber = this.common.getFamilyInformation();
		if (familyNumber) {
			console.log('family number', familyNumber);
			this.getFamilyOutstandingDetail(familyNumber);
		}
	}
	getFamilyOutstandingDetail(familyNumber) {
		this.familyOutstandingArr = [];
		this.childDataArr = [];
		this.feeService.getFamilyOutstandingDetail({fam_entry_number: familyNumber}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.familyOutstandingArr = result.data;
				this.childDataArr = result.data.childData;
			}
		});
	}

}
