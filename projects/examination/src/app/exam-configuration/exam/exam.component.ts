import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService, ExamService } from '../../_services';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material';
import { CapitalizePipe } from '../../../../../examination/src/app/_pipes';

@Component({
	selector: 'app-exam',
	templateUrl: './exam.component.html',
	styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit {
  displayedColumns: string[] = ['name', 'sexam_desc', 'status', 'modify'];
	subExamForm: FormGroup;
	currentUser: any;
	session: any;
	ckeConfig: any = {};
  subExamArray: any[] = [];
  ELEMENT_DATA: Element[] = [];
	rollNoDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
	constructor(
		public dialog: MatDialog,
		private fbuild: FormBuilder,
		private smartService: SmartService,
		public commonService: CommonAPIService,
		public axiomService: AxiomService,
		public sisService: SisService,
		public examService: ExamService
	) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.session = JSON.parse(localStorage.getItem('session'));
	}
	ngOnInit() {
		this.buildForm();
	}
	buildForm() {
		this.subExamForm = this.fbuild.group({
			sexam_name: '',
			sexam_desc: '',
		});
	}
	submit() {
		if (this.subExamForm.valid) {
			this.examService.insertSubExam(this.subExamForm.value).subscribe((result_i: any) => {
				if (result_i && result_i.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Sub Exam Added Successfully', 'success');
				} else {
					this.commonService.showSuccessErrorMessage('Insert failed', 'error');
				}
			});
		}
	}
	getSubExam() {
		this.examService.getSubExam({ status: '1' }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.subExamArray = result.data;
			}
		});
	}
}
