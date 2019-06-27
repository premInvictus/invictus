import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { AxiomService, SisService, SmartService, CommonAPIService } from '../../_services';
import { AssignmentModel } from './assignment-review.model';
import { AssignmentAttachmentDialogComponent } from '../../smart-shared/assignment-attachment-dialog/assignment-attachment-dialog.component';

@Component({
	selector: 'app-assignment-review',
	templateUrl: './assignment-review.component.html',
	styleUrls: ['./assignment-review.component.css']
})
export class AssignmentReviewComponent implements OnInit {

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
	currentUser: any = {};
	isTeacher = false;
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
		this.sisService.getClass({}).subscribe((result: any) => {
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
		this.axiomService.getSubjectsByClass({ class_id: this.paramForm.value.class_id }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.subjectArray = result.data;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	getSubject() {
		this.subjectArray = [];
		this.axiomService.getSubject().subscribe((result: any) => {
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
						console.log(this.ELEMENT_DATA);

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
			width: '800px',
			height: '50%',
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
			console.log('clossing dialog');
			console.log(dresult);
			if (dresult && dresult.assignment_desc) {
				const param: any = {};
				param.as_id = currentAttachment.as_id;
				param.as_assignment_desc = dresult.assignment_desc;
				param.as_attachment = dresult.attachments;
				this.smartService.assignmentUpdate(param).subscribe((result: any) => {
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
			width: '800px',
			height: '50%',
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
			console.log('clossing dialog');
			console.log(dresult);
			if (dresult && dresult.added) {
				console.log(dresult);
				this.getAssignment();
			}
		});
	}
	reserParam() {
		this.paramForm.patchValue({
			class_id: '',
			sub_id: ''
		});
		this.getSubject();
	}
	deleteAssignment(value) {
		console.log('deleteAssignment', value);
		if (value.as_id) {
			this.smartService.assignmentDelete({as_id: value.as_id}).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
					this.getAssignment();
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
				}
			});
		}
	}
	openModal = (data) => this.deleteModalRef.openModal(data);

}
