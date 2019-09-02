import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService, ExamService } from '../../_services';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material';
import { Element } from './sub-exam.model';
import { CapitalizePipe } from '../../../../../examination/src/app/_pipes';

@Component({
	selector: 'app-sub-exam',
	templateUrl: './sub-exam.component.html',
	styleUrls: ['./sub-exam.component.css']
})
export class SubExamComponent implements OnInit {
	displayedColumns: string[] = ['name', 'sexam_desc', 'status', 'modify'];
	subExamForm: FormGroup;
	currentUser: any;
	session: any;
	ckeConfig: any = {};
	subExamArray: any[] = [];
	ELEMENT_DATA: Element[] = [];
	UpdateFlag = false;
	viewOnly = true;
	subExamDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
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
		this.getSubExam();
	}
	buildForm() {
		this.subExamForm = this.fbuild.group({
			sexam_name: '',
			sexam_desc: '',
		});
	}
	resetForm() {
		this.subExamForm.patchValue({
			'sexam_name': '',
			'sexam_desc': ''
		});
	}
	submit() {
		if (this.subExamForm.valid) {
			this.examService.insertSubExam(this.subExamForm.value).subscribe((result_i: any) => {
				if (result_i && result_i.status === 'ok') {
					this.getSubExam();
					this.resetForm();
					this.commonService.showSuccessErrorMessage('Sub Exam Added Successfully', 'success');
				} else {
					this.commonService.showSuccessErrorMessage('Insert failed', 'error');
				}
			});
		}
	}
	getSubExam() {
		this.ELEMENT_DATA = [];
		this.subExamDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
		this.examService.getSubExam({ status: '1' }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.subExamArray = result.data;
				for (const item of this.subExamArray) {
					this.ELEMENT_DATA.push({
						name: new CapitalizePipe().transform(item.sexam_name),
						sexam_desc: item.sexam_desc,
						status: item,
						modify: '',
					});
				}
				this.subExamDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
			}
		});
	}
	getActiveStatus(value: any) {
		console.log(value);
		if (value.sexam_status === '1') {
			return true;
		}
	}
	toggleStatus(value: any) {
		if (value.sexam_status === '1') {
			value.sexam_status = '0';
		} else {
			value.sexam_status = '1';
		}
		this.examService.updateSubExamStatus(value).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.commonService.showSuccessErrorMessage('Status Changed', 'success');
				this.getSubExam();
			}
		});
	}
	formEdit(value: any) {
		this.UpdateFlag = true;
		this.viewOnly = false;
		this.subExamForm.patchValue({
			sexam_name: value.sexam_name,
			sexam_desc: value.sexam_desc
		});
	}
}
