

import { Component, OnInit, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { AxiomService, SisService, SmartService, CommonAPIService } from '../../_services';
// import { AssignmentModel } from './assignment-review.model';
import { AssignmentAttachmentDialogComponent } from '../../smart-shared/assignment-attachment-dialog/assignment-attachment-dialog.component';
import { PreviewDocumentComponent } from '../../smart-shared/preview-document/preview-document.component';
import { AddSessionComponenetComponent } from '../../smart-shared/add-session-componenet/add-session-componenet.component';
import { DatePipe } from '@angular/common';
import { ZoomMtg } from '@zoomus/websdk';
import { EditOnlineSessionComponent } from '../../smart-shared/edit-online-session/edit-online-session.component';

ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();
@Component({
  selector: 'app-scheduleclasses',
  templateUrl: './scheduleclasses.component.html',
  styleUrls: ['./scheduleclasses.component.css'],
	encapsulation: ViewEncapsulation.Emulated
})
export class ScheduleclassesComponent implements OnInit, AfterViewInit {

	paramForm: FormGroup;
	classArray: any[] = [];
	subjectArray: any[] = [];
	assignmentArray: any[] = [];
	toMin = new Date();
	ELEMENT_DATA:any= [];
	displayedColumns: string[] = [];
	dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
	selection = new SelectionModel<any>(true, []);
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
	sectionArray: any[] = [];
	isBoard = false;
	access_key: any;
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
		this.commonAPIService.getGlobalSetting({ gs_alias: 'onlne_session_key' }).subscribe((res:any) => {
			this.access_key = JSON.parse(res.data[0].gs_value);
		})
		// if (this.currentUser.role_id === '3') {
		// 	this.isTeacher = true;
		// 	this.displayedColumns = ['class', 'subject', 'topic', 'assignment', 'entrydate', 'assignedby', 'attachment', 'action'];
		// 	this.paramForm.patchValue({
		// 		teacher_id: this.currentUser.login_id
		// 	});
			
		// } else {
		// 	this.displayedColumns = ['select', 'class', 'subject', 'topic', 'assignment', 'entrydate', 'assignedby', 'attachment', 'action'];
		// }
		this.displayedColumns = ['class', 'section', 'subject', 'teacher', 'date', 'start', 'end', 'platform', 'period', 'action'];
		// this.paramForm.patchValue({
		// 	teacher_id: this.currentUser.login_id
		// });
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
			from_date: [new Date(), Validators.required],
			to_date: [new Date(), Validators.required],
			class_id: '',
			sub_id: '',
			sec_id: ''
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
		this.smartService.getSubjectsByClass({ class_id: this.paramForm.value.class_id,sub_timetable:1 }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.subjectArray = result.data;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	getListbyClass() {
		
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
			this.smartService.getSessionPerClass(param).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.assignmentArray = result.data;
					//console.log(result.data);
					if (this.assignmentArray.length > 0) {
						this.nodataFlag = false;
						let i = 0;
						this.assignmentArray.forEach(item => {
							let sec  = item.tsoc_sec.split(",");
							let sec_string = '';
							sec.forEach(element => {
								this.sectionArray.forEach(e => {
									if(parseInt(e.sec_id) == parseInt(element)) {
										sec_string += e.sec_name + ' ';
									}
								})
							});
							const each: any = {};
							each.srno = ++i;
							each.class = item.class_name;
							each.section = sec_string;
							each.subject = item.sub_name;
							//'class', 'section', 'subject', 'teacher', 'date', 'start', 'end', 'platform', 'period', 'action'
							each.teacher = item.au_full_name;
							each.date = new DatePipe('en-US').transform(item.tsoc_class_date);
							each.action = item;
							each.start = item.tsoc_start_time;
							each.end = item.tsoc_end_time;
							each.platform = item.tsoc_type == 'zoom' ? "Zoom" : item.tsoc_type == 'google' ? "Google Meet" : item.tsoc_type == 'team' ? "Microsoft Team" : "Other";
							each.period = item.ae_name;
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
	checkboxLabel(row?: any): string {
		if (!row) {
			return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
		}
		return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.srno + 1}`;
	}
	attachmentDialog(currentAttachment) {
		console.log("-----------------------", currentAttachment);
		
		const dialogRef = this.dialog.open(EditOnlineSessionComponent, {
			width: '950px',
			height: '500px',
			data: {
				page: 'assignment',
				title: 'Edit Session',
				edit: false,
				multiple : true,
				attachments: currentAttachment.as_attachment ? currentAttachment.as_attachment : [],
				class_id: currentAttachment.class_id,
				sec_id: currentAttachment.sec_id,
				sub_id: currentAttachment.sub_id,
				topic_id: currentAttachment.topic_id,
				assignment_desc: currentAttachment.as_assignment_desc,
				currentAttachment:currentAttachment
			} 
		});
		dialogRef.afterClosed().subscribe(dresult => {
			// console.log('clossing dialog');
			// console.log(dresult);
			this.getAssignment();
			// if (dresult && dresult.assignment_desc) {
			// 	this.disabledApiButton = true;
			// 	const param: any = {};
			// 	param.as_id = currentAttachment.as_id;
			// 	param.as_assignment_desc = dresult.assignment_desc;
			// 	param.as_attachment = dresult.attachments;
			// 	this.smartService.assignmentUpdate(param).subscribe((result: any) => {
			// 		this.disabledApiButton = false;
			// 		if (result && result.status === 'ok') {
			// 			this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
			// 			this.getAssignment();
			// 		} else {
			// 			this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			// 		}
			// 	});
			// }
		});
	}
	openAddAttachmentDialog() {
		const dialogRef = this.dialog.open(AddSessionComponenetComponent, {
			width: '950px',
			height: '500px',
			data: {
				page: 'session',
				title: 'Add Session',
				edit: true,
				multiple : true,
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
			sub_id: '',
			sec_id: ''
		});
		this.assignmentArray = [];
		this.ELEMENT_DATA = [];
		this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
		this.nodataFlag = true;
		this.getSubject();
	}
	
	deleteAssignment(value) {
		//console.log('deleteAssignment', value);
		if (value.tsoc_id) {
			this.smartService.deleteOnlineClass({ tsoc_id: value.tsoc_id }).subscribe((result: any) => {
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
	getSectionsByClass() {
		this.sectionArray = [];
		this.sisService.getSectionsByClass({ class_id: this.paramForm.value.class_id }).subscribe((result: any) => {
		  if (result.status === 'ok') {
			const index = this.classArray.findIndex(f => Number(f.class_id) === Number(this.paramForm.value.class_id));
			this.sectionArray = result.data;
			if (index !== -1) {
			  this.isBoard = this.classArray[index] && this.classArray[index].is_board === '0' ? false : true;
	
			}
		  }
		});
	  }
	  joinclass(item) {
		if(item.tsoc_type == 'zoom') {
			let name:any = {}
			this.access_key.forEach(element => {
				if(element.name == 'zoom') {
					name = element;
				}
			});
			console.log("i am element", name);
			
			let spliturl = item.tsoc_url.split('/')[4];
			let mId = spliturl.split('?')[0];
			let pwd = spliturl.split("pwd=")[1];
	
			console.log("i am here", mId, pwd);
			
			
			let signature = ZoomMtg.generateSignature({
				meetingNumber: mId,
				apiKey: name.apiacess,
				apiSecret:  name.apisecret,
				role: '5'
			  });
			  
			  document.getElementById('zmmtg-root').style.display = 'block'
	
			  ZoomMtg.init({
				leaveUrl: window.location.href,
				showMeetingHeader: false, //option
				disableInvite: true, //optional
				disableCallOut: false, //optional
				disableRecord: false, //optional
				disableJoinAudio: false, //optional
				audioPanelAlwaysOpen: true, //optional
				showPureSharingContent: false, //optional
				isSupportAV: true, //optional,
				isSupportChat: true, //optional,
				isSupportQA: true, //optional,
				isSupportPolling: true, //optional
				isSupportBreakout: true, //optional
				isSupportCC: true, //optional,
				screenShare: true, //optional,
				rwcBackup: '', //optional,
				videoDrag: true, //optional,
				sharingMode: 'both', //optional,
				videoHeader: true, //optional,
				isLockBottom: true, // optional,
				isSupportNonverbal: true, // optional,
				isShowJoiningErrorDialog: true, 
				success: (success) => {
				  console.log(success, signature);
		  
				  ZoomMtg.join({
					signature: signature,
					meetingNumber: mId,
					userName:'Admin',
					apiKey: name.apiacess,
					userEmail: item.tsoc_admin_email,
					passWord: pwd,
					success: (success) => {
					  console.log(success)
					},
					error: (error) => {
					  console.log(error)
					}
				  })
		  
				},
				error: (error) => {
				  console.log(error)
				}
			  }) 
			} else {
				this.commonAPIService.showSuccessErrorMessage( "No class assigned", 'error')
			}
	  }
	assignmentSend(valuel) {
		
	}
	doAssignmentFilter(value: string) {
		this.dataSource.filter = value.trim();
	}
	changePage(pageEvent: PageEvent) {
		//console.log(pageEvent);
		// this.paginator.length = 100;
	}

}

