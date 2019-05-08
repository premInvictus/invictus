import { Component, OnInit } from '@angular/core';
import { QelementService } from '../../questionbank/service/qelement.service';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-jee-advanced-instruction',
	templateUrl: './jee-advanced-instruction.component.html',
	styleUrls: ['./jee-advanced-instruction.component.css']
})
export class JeeAdvancedInstructionComponent implements OnInit {
	currentUser: any = {};
	userDetails: any = {};
	examDetail: any = {};
	es_id: any;
	timeDiffer: any = '';
	constructor( private qelementService: QelementService,
							private route: ActivatedRoute) { }

	ngOnInit() {
		document.addEventListener('contextmenu', (e) => {
			e.preventDefault();
	}, false);
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.es_id = this.route.snapshot.params['id'];
		this.getUser();
	}
	getUser() {
		const param: any = {};
		param.role_id = this.currentUser.role_id;
		param.login_id = this.currentUser.login_id;
		this.qelementService.getUser(param).subscribe(
			(result: any) => {
				if (result.data.length > 0) {
					this.userDetails = result.data[0];
					this.qelementService.getScheduledExam({es_id: this.es_id}).subscribe((result2: any) => {
						if (result2) {
							this.examDetail = result2.data[0];
							this.timeDiffer = new Date(this.examDetail.es_end_date + ' ' + this.examDetail.es_end_time).getTime() -
							new Date(this.examDetail.es_start_date + ' ' + this.examDetail.es_start_time).getTime();
							this.timeDiffer = (this.timeDiffer / 1000) / 3600;
						}
					});
				}
			}
		);
	}
	convertFloat(value) {
		const parseValue = Math.round(value * 100) / 100;
		return parseValue;
}
}
