import { Component, OnInit, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { AxiomService, SisService, SmartService, CommonAPIService } from '../../_services';
import { AssignmentModel } from './assignment-review.model';
import { AssignmentAttachmentDialogComponent } from '../../smart-shared/assignment-attachment-dialog/assignment-attachment-dialog.component';
import { PreviewDocumentComponent } from '../../smart-shared/preview-document/preview-document.component';
@Component({
	selector: 'app-assignment-review',
	templateUrl: './assignment-review.component.html',
	styleUrls: ['./assignment-review.component.css'],
	encapsulation: ViewEncapsulation.Emulated
})
export class AssignmentReviewComponent implements OnInit, AfterViewInit {

	paramForm: FormGroup;
	classArray: any[] = [];
	subjectArray: any[] = [];
	assignmentArray: any[] = [];
	toMin = new Date();
	ELEMENT_DATA: AssignmentModel[] = [];
	displayedColumns: string[] = [];
	dataSource = new MatTableDataSource<AssignmentModel>(this.ELEMENT_DATA);
	selection = new SelectionModel<AssignmentModel>(true, []);
	nodataFlag = true;
	@ViewChild('deleteModalRef') deleteModalRef;
	@ViewChild('sendModalRef') sendModalRef;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	currentUser: any = {};
	isTeacher = false;
	pageLength: number;
	pageSize = 10;
	pageSizeOptions = [5, 10, 25, 100];
	limit = this.pageSize;
	offset = 0;
	disabledApiButton = false;
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
			this.displayedColumns = ['class', 'subject', 'topic', 'assignment', 'entrydate', 'assignedby', 'attachment', 'action'];
			this.paramForm.patchValue({
				teacher_id: this.currentUser.login_id
			});
			this.getAssignment();
		} else {
			this.displayedColumns = ['select', 'class', 'subject', 'topic', 'assignment', 'entrydate', 'assignedby', 'attachment', 'action'];
		}
		this.getClass();
		this.getSubject();
	}

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
	}
	buildForm() {
		this.paramForm = this.fbuild.group({
			teacher_name: '',
			teacher_id: '',
			from: [new Date(), Validators.required],
			to: [new Date(), Validators.required],
			class_id: '',
			sub_id: ''
		});
	}
	getClass() {
		this.classArray = [];
		this.smartService.getClassData({ class_status: '1' }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.classArray = result.data;
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
		this.smartService.getSubject({ sub_timetable: 1 }).subscribe((result: any) => {
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
		this.selection.clear();
		if (this.paramForm.valid) {
			this.assignmentArray = [];
			this.ELEMENT_DATA = [];
			this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
			const param = this.paramForm.value;
			/* if (param.from) {
				param.from = this.commonAPIService.dateConvertion(param.from);
			}
			if (param.to) {
				param.to = this.commonAPIService.dateConvertion(param.to);
			} */
			param.as_status = ['0']; // not published or not sent
			param.withDate = false;
			/* param.limit = this.limit;
			param.offset = this.offset; */
			this.smartService.getAssignment(param).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.assignmentArray = result.data;
					//console.log(result.data);
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
							each.attachment = item.as_attachment.length;
							each.action = item;
							this.ELEMENT_DATA.push(each);
						});
						this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
						this.dataSource.paginator = this.paginator;
						this.pageLength = this.ELEMENT_DATA.length;
						//console.log(this.ELEMENT_DATA);

					}
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
					this.nodataFlag = true;
				}
			});
		}
	}
	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}

	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterToggle() {
		this.isAllSelected() ?
			this.selection.clear() :
			this.dataSource.data.forEach(row => this.selection.select(row));
	}

	/** The label for the checkbox on the passed row */
	checkboxLabel(row?: AssignmentModel): string {
		if (!row) {
			return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
		}
		return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.srno + 1}`;
	}
	attachmentDialog(currentAttachment) {
		const dialogRef = this.dialog.open(AssignmentAttachmentDialogComponent, {
			width: '950px',
			height: '500px',
			data: {
				page: 'assignment',
				title: 'Edit Assignment',
				edit: false,
				attachments: currentAttachment.as_attachment ? currentAttachment.as_attachment : [],
				class_id: currentAttachment.class_id,
				sec_id: currentAttachment.sec_id,
				sub_id: currentAttachment.sub_id,
				topic_id: currentAttachment.topic_id,
				assignment_desc: currentAttachment.as_assignment_desc
			} 
		});
		dialogRef.afterClosed().subscribe(dresult => {
			// console.log('clossing dialog');
			// console.log(dresult);
			if (dresult && dresult.assignment_desc) {
				this.disabledApiButton = true;
				const param: any = {};
				param.as_id = currentAttachment.as_id;
				param.as_assignment_desc = dresult.assignment_desc;
				param.as_attachment = dresult.attachments;
				this.smartService.assignmentUpdate(param).subscribe((result: any) => {
					this.disabledApiButton = false;
					if (result && result.status === 'ok') {
						this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
						this.getAssignment();
					} else {
						this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
					}
				});
			}
		});
	}
	openAddAttachmentDialog() {
		const dialogRef = this.dialog.open(AssignmentAttachmentDialogComponent, {
			width: '950px',
			height: '500px',
			data: {
				page: 'assignment',
				title: 'Add Assignment',
				edit: true,
				attachments: [],
				class_id: this.paramForm.value.class_id,
				sec_id: '',
				sub_id: this.paramForm.value.sub_id,
				topic_id: '',
				assignment_desc: ''
			}
		});
		dialogRef.afterClosed().subscribe(dresult => {
			// console.log('clossing dialog');
			// console.log(dresult);
			if (dresult && dresult.added) {
				this.getAssignment();
			}
		});
	}
	reserParam() {
		this.paramForm.patchValue({
			class_id: '',
			sub_id: ''
		});
		this.assignmentArray = [];
		this.ELEMENT_DATA = [];
		this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
		this.nodataFlag = true;
		this.getSubject();
	}
	deleteAssignment(value) {
		//console.log('deleteAssignment', value);
		if (value.as_id) {
			this.smartService.assignmentDelete({ as_id: value.as_id }).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
					this.getAssignment();
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
				}
			});
		}
	}
	openModal = (data) => {
		data.text = 'Delete';
		this.deleteModalRef.openModal(data);
	}
	openSendModal = (data) => {
		data.text = 'Send';
		this.sendModalRef.openModal(data);
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

	sendAssignment(asIdArray) {
		//console.log(asIdArray);
		this.smartService.sendAssignment({ as_id: asIdArray }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				console.log(result.data);
				this.getAssignment();
				this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	assignmentSend(valuel) {
		const asIdArray = [];
		if (valuel.as_id) {
			asIdArray.push(valuel.as_id);
		} else {
			if (this.selection.selected.length > 0) {
				this.selection.selected.forEach(item => {
					asIdArray.push(item.as_id);
				});
			} else {
				this.commonAPIService.showSuccessErrorMessage('Please select assignment', 'error');
			}
		}
		if (asIdArray.length > 0) {
			this.sendAssignment(asIdArray);
		}
	}
	doAssignmentFilter(value: string) {
		this.dataSource.filter = value.trim();
	}
	changePage(pageEvent: PageEvent) {
		//console.log(pageEvent);
		// this.paginator.length = 100;
	}

}
