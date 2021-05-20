import { Component, OnInit, ViewChild, AfterViewInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { AxiomService, SisService, SmartService, CommonAPIService } from '../../_services';
import { Element,AssignmentModel } from './assignment-review.model';
import { PreviewDocumentComponent } from '../../smart-shared/preview-document/preview-document.component';
import * as XLSX from 'xlsx';
declare var require;
import * as Excel from 'exceljs/dist/exceljs';
const jsPDF = require('jspdf');
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { CapitalizePipe } from '../../../../../fee/src/app/_pipes';

@Component({
	selector: 'app-view-asssignment',
	templateUrl: './view-asssignment.component.html',
	styleUrls: ['./view-asssignment.component.css']
})
export class ViewAsssignmentComponent implements OnInit {

	@Input() currentAssignment;
	@Output() backEvent = new EventEmitter<any>();
	paramForm: FormGroup;
	obtained_marks_arr = [];
	classArray: any[] = [];
	subjectArray: any[] = [];
	sectionArray: any[] = [];
	assignmentArray: any[] = [];
	toMin = new Date();
	ELEMENT_DATA1: AssignmentModel[] = [];
	ELEMENT_DATA: Element[] = [];
	dataArr: any[] = [];
	sessionArray: any[] = [];
	displayedColumns1 = ['class', 'subject', 'topic', 'assignment', 'assignedby', 'publishedby', 'attachment','entrydate'];
	dataSource1 = new MatTableDataSource<AssignmentModel>(this.ELEMENT_DATA1);
	displayedColumns = ['srno', 'admission_no', 'name', 'attachment', 'sas_obtained_marks','entrydate'];
	dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
	nodataFlag = true;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	currentUser: any = {};
	isTeacher = false;
	submited_count = 0;
	total_count = 0;
	pageLength: number;
	pageSize = 10;
	pageSizeOptions = [5, 10, 25, 100];
	limit = this.pageSize;
	offset = 0;
	session: any;
	schoolInfo: any = {};
	sessionName: any;
	length: any;
	period = 0;
	alphabetJSON = {
		1: 'A',
		2: 'B',
		3: 'C',
		4: 'D',
		5: 'E',
		6: 'F',
		7: 'G',
		8: 'H',
		9: 'I',
		10: 'J',
		11: 'K',
		12: 'L',
		13: 'M',
		14: 'N',
		15: 'O',
		16: 'P',
		17: 'Q',
		18: 'R',
		19: 'S',
		20: 'T',
		21: 'U',
		22: 'V',
		23: 'W',
		24: 'X',
		25: 'Y',
		26: 'Z',
		27: 'AA',
		28: 'AB',
		29: 'AC',
		30: 'AD',
		31: 'AE',
		32: 'AF',
		33: 'AG',
		34: 'AH',
		35: 'AI',
		36: 'AJ',
		37: 'AK',
		38: 'AL',
		39: 'AM',
		40: 'AN',
		41: 'AO',
		42: 'AP',
		43: 'AQ',
		44: 'AR',
	};
	constructor(
		private fbuild: FormBuilder,
		private axiomService: AxiomService,
		private sisService: SisService,
		private smartService: SmartService,
		private commonAPIService: CommonAPIService,
		public dialog: MatDialog
	) {
		this.session = JSON.parse(localStorage.getItem('session'));
	}
	ngOnInit() {
		console.log('currentAssignment', this.currentAssignment);
		if(this.currentAssignment){
			const each: any = {};
			each.class = this.currentAssignment.class_name + ' - ' + this.currentAssignment.sec_name;
			each.subject = this.currentAssignment.sub_name;
			each.topic = this.currentAssignment.topic_name;
			each.assignment = this.currentAssignment.as_assignment_desc;
			each.entryDate = this.currentAssignment.as_entry_date;
			each.assignedBy = this.currentAssignment.au_full_name;
			each.publishedBy = this.currentAssignment.published_by;
			each.attachment = this.currentAssignment.as_attachment.length;
			this.ELEMENT_DATA1.push(each);
			this.dataSource1 = new MatTableDataSource(this.ELEMENT_DATA1);
		}
		this.buildForm();
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		if (this.currentUser.role_id === '3') {
			this.isTeacher = true;
			this.paramForm.patchValue({
				teacher_id: this.currentUser.login_id
			});
			this.getMasterStudentDetail();
		}
		this.getClass();
		this.getSession();
		this.getSchool();
	}
	// get session name by session id
	getSession() {
		this.sisService.getSession()
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						for (const citem of result.data) {
							this.sessionArray[citem.ses_id] = citem.ses_name;
						}
						this.sessionName = this.sessionArray[this.session.ses_id];
					}
				});
	}
	// get end month and start month of school
	getSchool() {
		this.sisService.getSchool()
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.schoolInfo = result.data[0];
					}
				});
	}
	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
	}
	buildForm() {
		const from = new Date();
		from.setDate(from.getDate() - 7);
		this.paramForm = this.fbuild.group({
			teacher_name: '',
			teacher_id: '',
			class_id: '',
			sec_id: '',
		});
	}
	getClass() {
		this.paramForm.patchValue({
			class_id: this.currentAssignment.class_id,
			sec_id: this.currentAssignment.param_sec_id,
		});
		this.classArray = [];
		this.smartService.getClassData({ class_status: '1' }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.classArray = result.data;
				this.getSectionsByClass();
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}

	getSectionsByClass() {
		this.sectionArray = [];
		this.smartService.getSectionsByClass({ class_id: this.paramForm.value.class_id }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.sectionArray = result.data;
				this.getMasterStudentDetail();
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	setMinTo(event) {
		this.toMin = event.value;
	}
	getMasterStudentDetail() {
		if (this.paramForm.value.class_id && this.paramForm.value.sec_id) {
			this.assignmentArray = [];
			this.ELEMENT_DATA = [];
			this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
			let param = this.paramForm.value;
			param['enrollment_type'] = '4';
			this.sisService.getMasterStudentDetail(param).subscribe(async (result: any) => {
				if (result && result.status === 'ok') {
					let assignmentSubmit_arr = [];
					let param1: any = {};
					param1.as_id = this.currentAssignment.as_id;
					await this.smartService.getAssignmentSubmit(param1).toPromise().then((result1: any) => {
						if (result1 && result1.status === 'ok') {
							assignmentSubmit_arr = result1.data;
							console.log('assignmentSubmit_arr', assignmentSubmit_arr);

						}
					});
					this.assignmentArray = result.data;
					console.log('assignmentSubmit_arr', assignmentSubmit_arr);
					if (this.assignmentArray.length > 0) {
						this.nodataFlag = false;
						let i = 0;
						this.assignmentArray.forEach(item => {

							const each: any = {};
							each.srno = ++i;
							each.admission_no = item.em_admission_no;
							each.name = item.au_full_name;
							each.class = item.class_name + ' - ' + item.sec_name;
							each.entrydate = '';
							each.attachment = [];
							let sas_obtained_marks = '';
							const findex = assignmentSubmit_arr.findIndex(e => e.sas_login_id == item.au_login_id);
							if (findex != -1) {
								each.entrydate = assignmentSubmit_arr[findex]['sas_entry_date'];
								each.attachment = assignmentSubmit_arr[findex]['as_attachment'];
								sas_obtained_marks = assignmentSubmit_arr[findex]['sas_obtained_marks'];
								this.submited_count++;
							}
							this.obtained_marks_arr.push({
								eachform: this.fbuild.group({
									'sas_login_id': item.au_login_id,
									'sas_as_id': this.currentAssignment.as_id,
									'sas_obtained_marks': sas_obtained_marks
								})
							})
							this.ELEMENT_DATA.push(each);
							this.total_count++;
						});
						this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
						this.dataSource.paginator = this.paginator;
						this.pageLength = this.ELEMENT_DATA.length;
						console.log('final', this.ELEMENT_DATA);

					}
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
					this.nodataFlag = true;
				}
			});
		}
	}

	resetParam() {
		this.paramForm.patchValue({
			class_id: '',
			sec_id: '',
		});
	}

	previewDocuments(attachmentArray) {
		if (attachmentArray && attachmentArray.length > 0) {
			const dialogRef = this.dialog.open(PreviewDocumentComponent, {
				height: '80%',
				width: '1000px',
				data: {
					index: '',
					images: attachmentArray
				}
			});
		}
	}

	doAssignmentFilter(value: string) {
		this.dataSource.filter = value.trim();
	}
	changePage(pageEvent: PageEvent) {
		console.log(pageEvent);
		// this.paginator.length = 100;
	}
	back() {
		this.backEvent.emit({ page: 'assignment' });
	}
	submitMarks() {
		let marks_arr = [];
		this.obtained_marks_arr.forEach(element => {
			if (element.eachform.value.sas_obtained_marks) {
				marks_arr.push(element.eachform.value)
			}
		});
		if (marks_arr.length > 0) {
			console.log('marks_arr', marks_arr);
			this.smartService.updateAssignmentSubmitMarks(marks_arr).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.commonAPIService.showSuccessErrorMessage('Marks updated successfully', 'success');
				}
			});
		}

	}

}
