import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../_services/report.service';
import {ActivatedRoute} from '@angular/router';
import { BreadCrumbService } from '../../_services/index';
import { QelementService } from '../../questionbank/service/qelement.service';

@Component({
	selector: 'app-teacher-report-analysis',
	templateUrl: './teacher-report-analysis.component.html',
	styleUrls: ['./teacher-report-analysis.component.css']
})
export class TeacherReportAnalysisComponent implements OnInit {

	loading = false;
	divId = 1;
	es_id: number;
	resDesFlag = true;

	homeUrl: string;
	examDetail: any = {};
	questionpaperDetail: any;
	studentArray: any;
	ngOnInit() {
		this.homeUrl = this.breadCrumbService.getUrl();
		this.es_id = this.route.snapshot.params['id'];
		this.getTestQuestions();
		this.getScheduledExam();
	}
	setDivId(divId) {
		this.divId = divId;
	}
	constructor(
		private route: ActivatedRoute,
		private qelementService: QelementService,
		private reportService: ReportService,
		private breadCrumbService: BreadCrumbService,
	) { }

	getTestQuestions(): void {
		this.resDesFlag = true;
		this.loading = true;
		this.reportService.testQuestionAnalysis({es_id: this.es_id}).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.loading = false;
					for (const qus of result.data) {
						if (Number(qus.qst_id) !== 1) {
							this.resDesFlag = false;
							break;
						}
					}
				}
			});
	}

	getScheduledExam() {

		this.qelementService.getScheduledExam({ es_id: this.es_id, es_status: '2' }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.examDetail = result.data[0];
					this.getStudents();

					this.qelementService.getQuestionPaper({ qp_id: this.examDetail.es_qp_id }).subscribe(
						(result1: any) => {
							if (result1 && result1.status === 'ok') {
								this.questionpaperDetail = result1.data[0];

							}
						}
					);
				}
			}
		);
	}

	getStudents() {
		const param = { class_id: this.examDetail.es_class_id, sec_id: this.examDetail.es_sec_id, role_id: '4', status: '1' };
		this.qelementService.getUser(param).subscribe(
			(result: any) => {

				if (result && result.status === 'ok') {
					this.studentArray = result.data;
				}
			}
		);
	}
}
