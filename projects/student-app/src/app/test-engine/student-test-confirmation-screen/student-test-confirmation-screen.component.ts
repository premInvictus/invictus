import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { QelementService } from 'projects/axiom/src/app/questionbank/service/qelement.service';

@Component({
	selector: 'app-student-test-confirmation-screen',
	templateUrl: './student-test-confirmation-screen.component.html',
	styleUrls: ['./student-test-confirmation-screen.component.css']
})
export class StudentTestConfirmationScreenComponent implements OnInit {

	es_id: number;
	testResultFlag = true;
	examDetail: any = {};
	private xInterval;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private qelementService: QelementService
	) { }

	ngOnInit() {
		this.es_id = this.route.snapshot.params['id'];
		this.checkExamEnd();
	}
	checkExamEnd() {
		const this_ = this;
		this.qelementService.getScheduledExam({ es_id: this.es_id }).subscribe(
			(result: any) => {
				if (result.status === 'ok') {
					this.examDetail = result.data[0];
					if(this.examDetail.es_test_taker_report != 1){
						this.router.navigate(['../../test-summary', this.es_id], {relativeTo: this.route});
					} else {
						this.xInterval = setInterval(function () {
							this_.getTestResultFlag();
						}, 4000);
					}
				}
			});
	}

	getTestResultFlag() {
		this.qelementService.getScheduledExam({ es_id: this.es_id }).subscribe(
			(result: any) => {
				if (result.status === 'ok') {
					this.examDetail = result.data[0];
					if (Number(this.examDetail.es_status) === 2) {
						this.testResultFlag = false;
						clearInterval(this.xInterval);
						this.router.navigate(['../../test-summary', this.es_id], {relativeTo: this.route});
					} else if (Number(this.examDetail.es_exam_type) === 2) {
						setTimeout(() => {
							this.testResultFlag = false;
						}, 3000);
						clearInterval(this.xInterval);
					}
				}
			});
	}
}
