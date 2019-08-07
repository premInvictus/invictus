import { Component, OnInit, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { AxiomService, SisService, SmartService, CommonAPIService } from '../../_services';
import { AssignmentModel } from './assignment-review.model';
import { PreviewDocumentComponent } from '../../smart-shared/preview-document/preview-document.component';
@Component({
	selector: 'app-past-assignments',
	templateUrl: './past-assignments.component.html',
	styleUrls: ['./past-assignments.component.css'],
	encapsulation: ViewEncapsulation.Emulated
})
export class PastAssignmentsComponent implements OnInit, AfterViewInit {

	paramForm: FormGroup;
	classArray: any[] = [];
	subjectArray: any[] = [];
	sectionArray: any[] = [];
	assignmentArray: any[] = [];
	toMin = new Date();
	ELEMENT_DATA: AssignmentModel[] = [];
	displayedColumns = ['srno', 'class', 'subject', 'topic', 'assignment', 'entrydate', 'assignedby', 'publishedby', 'attachment'];
	dataSource = new MatTableDataSource<AssignmentModel>(this.ELEMENT_DATA);
	nodataFlag = true;
	@ViewChild('deleteModalRef') deleteModalRef;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	currentUser: any = {};
	isTeacher = false;
	pageLength: number;
	pageSize = 10;
	pageSizeOptions = [5, 10, 25, 100];
	limit = this.pageSize;
	offset = 0;
	constructor(
		private fbuild: FormBuilder,
		private axiomService: AxiomService,
		private sisService: SisService,
		private smartService: SmartService,
		private commonAPIService: CommonAPIService,
		public dialog: MatDialog
	) { }

	openEditAssignment() {

	}

	ngOnInit() {
		this.buildForm();
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		if (this.currentUser.role_id === '3') {
			this.isTeacher = true;
			this.paramForm.patchValue({
				teacher_id: this.currentUser.login_id
			});
			this.getAssignment();
		}
		this.getClass();
		this.getSubject();
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
			from: [from, Validators.required],
			to: [new Date(), Validators.required],
			class_id: '',
			sec_id: '',
			sub_id: ''
		});
	}
	getClass() {
		this.classArray = [];
		this.smartService.getClass({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.classArray = result.data;
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
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}

	getSubjectsByClass() {
		this.subjectArray = [];
		this.paramForm.patchValue({
			sub_id: ''
		});
		this.smartService.getSubjectsByClass({ class_id: this.paramForm.value.class_id }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.subjectArray = result.data;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	getSubject() {
		this.subjectArray = [];
		this.smartService.getSubject({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.subjectArray = result.data;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	setMinTo(event) {
		this.toMin = event.value;
	}
	getAssignment() {
		if (this.paramForm.valid && (this.paramForm.value.class_id || this.paramForm.value.sec_id || this.paramForm.value.sub_id)) {
			this.assignmentArray = [];
			this.ELEMENT_DATA = [];
			this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
			const param = this.paramForm.value;
			if (param.from) {
				param.from = this.commonAPIService.dateConvertion(param.from);
			}
			if (param.to) {
				param.to = this.commonAPIService.dateConvertion(param.to);
			}
			param.as_status = ['1', '2']; // published or sent
			param.withDate = true;
			/* param.limit = this.limit;
			param.offset = this.offset; */
			this.smartService.getAssignment(param).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.assignmentArray = result.data;
					console.log(result.data);
					if (this.assignmentArray.length > 0) {
						this.nodataFlag = false;
						let i = 0;
						this.assignmentArray.forEach(item => {
							if (item.as_attachment && item.as_attachment.length > 0) {
								item.as_attachment.forEach(element => {
									element.file_name = element.atmt_name;
									element.file_url = element.atmt_url;
								});
							}
							const each: any = {};
							each.srno = ++i;
							each.as_id = item.as_id;
							each.class = item.class_name + ' - ' + item.sec_name;
							each.subject = item.sub_name;
							each.topic = item.topic_name;
							each.assignment = item.as_assignment_desc;
							each.entryDate = item.as_entry_date;
							each.assignedBy = item.au_full_name;
							each.publishedBy = item.published_by;
							each.attachment = item.as_attachment.length;
							each.action = item;
							this.ELEMENT_DATA.push(each);
						});
						this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
						this.dataSource.paginator = this.paginator;
						this.pageLength = this.ELEMENT_DATA.length;
						console.log(this.ELEMENT_DATA);

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
			sub_id: ''
		});
		this.getSubject();
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

}
