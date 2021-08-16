import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService } from '../../_services/index';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl, MatDialogRef } from '@angular/material';
import { MatDialog } from '@angular/material';
import { DatePipe } from '@angular/common';
import { PreviewDocumentComponent } from '../../hr-shared/preview-document/preview-document.component';
import {SelectionModel} from '@angular/cdk/collections';
import {Element} from './model';
import { ForwardCommunicationComponent } from '../../hr-shared/forward-communication/forward-communication.component'

@Component({
	selector: 'app-reviewer-messages',
	templateUrl: './reviewer-messages.component.html',
	styleUrls: ['./reviewer-messages.component.scss']
})
export class ReviewerMessagesComponent implements OnInit {
	@ViewChild('paginator') paginator: MatPaginator;
	dialogRef2: MatDialogRef<PreviewDocumentComponent>;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('searchModal') searchModal;
	showComposeMessage = false;
	searchForm: FormGroup;
	displayedColumns: string[] = []
	renderForm:any = {};
	scheduleMessageData: any[] = [];
	USER_ELEMENT_DATA: any[] = [];
	selectedUserArr: any[] = [];
	allUserSelectFlag = false;
	dataSource = new MatTableDataSource<Element>(this.USER_ELEMENT_DATA);
	currentUser = {};
	showViewMessage = false;
	@ViewChild('deleteModal') deleteModal;
	deleteMessage = 'Are you sure, you want to Delete Message ?';
	selection = new SelectionModel<Element>(true, []);
	bookpagesize = 100;
	bookpageindex = 0;
	totalRecords = 0;
	allstudent: any[] = [];
	constructor(
		private fbuild: FormBuilder,
		private route: ActivatedRoute,
		private commonAPIService: CommonAPIService,
		private sisService: SisService,
		private router: Router,
		private dialog: MatDialog
	) { 
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		
	}

	ngOnInit() {
		this.dataSource.sort = this.sort;
		this.sisService.getMasterStudentDetail({}).subscribe((element:any) => {
			// console.log("i am element", element);
			this.allstudent =  element.data;
			this.buildForm();
			this.getMessages();
			// console.log("in here");
			
		} )
		
		
		
	}
	/** Whether the number of selected elements matches the total number of rows. */
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
	  checkboxLabel(row?: Element): string {
		if (!row) {
		  return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
		}
		return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.no + 1}`;
	  }

	ngAfterViewInit() {
		this.dataSource.sort = this.sort;
		this.dataSource.paginator = this.paginator;
	}

	buildForm() {
		this.searchForm = this.fbuild.group({
			search: ''
		});
	}
	openForwardDialog(element=null) {
		
		if(!element) {
			if(this.selection.selected.length == 1) {
				element = this.selection.selected[0].action;
			}
		}
		console.log('element--',element);
		const diaogRef = this.dialog.open(ForwardCommunicationComponent, {
			width: '80%',
			height: '30%',
			position: {
			  top: '10%'
			},
			data: element
		});
		diaogRef.afterClosed().subscribe((result: any) => {
			console.log('afterClosed',result);
			if (result && result.status) {
				this.updateMessage('approved',{action:result.data});
			}
		});
	  }


	openDeleteDialog = (data) => {
		data['head'] = 'Delete';
		this.deleteModal.openModal(data);
	}
	fetchData(event?: PageEvent) {
		this.bookpageindex = event.pageIndex;
		this.bookpagesize = event.pageSize;
		this.getMessages();
		return event;
	}

	getMessages() {
		this.scheduleMessageData = [];
		this.USER_ELEMENT_DATA = [];
		this.displayedColumns = [
			// 'no',	
			'select',
			'schedule_date',
			'user_type',	
			'subject',
			// 'attachment',
			'send_by',
			'send_to',
			'type',
			'class_id',
			'login_id',
			'action'
		];
		var inputJson = {}; 
		inputJson['pageIndex'] = this.bookpageindex;
		inputJson['pageSize'] = this.bookpagesize;
		this.commonAPIService.getMessage(inputJson).subscribe((result: any) => {
			if (result && result.data && result.data[0]) {
				this.scheduleMessageData = result.data;
				this.totalRecords = result.totalRecord;
				this.prepareDataSource();
			}
		});
	}

	prepareDataSource() {
		this.selection.clear();
		this.dataSource = new MatTableDataSource<Element>(this.USER_ELEMENT_DATA);
		let counter = 1;
		for (let i = 0; i < this.scheduleMessageData.length; i++) {
			const tempObj = {};
			// let objmain = this.sisService.getStudentInformation({'au_login_id': this.scheduleMessageData[i]['msg_created_by']['login_id']}).subscribe((e:any) => {
			// 	tempObj['class_id'] = e[0]['class_name'] + '-'+ e[0]['sec_name'];
			// 	tempObj['au_login'] = e[0]['au_login_id'];
			// })
			this.allstudent.map((e:any) => {
				console.log("i am here", (e.au_login_id == this.scheduleMessageData[i]['msg_created_by']['login_id']), e.au_login_id , this.scheduleMessageData[i]['msg_created_by']['login_id']);
				
				if(e.au_login_id == this.scheduleMessageData[i]['msg_created_by']['login_id']) {
						tempObj['class_id'] = e['class_name'] + '-'+ e['sec_name'];
						tempObj['login_id'] = e['em_admission_no'];
				}
			})
			tempObj['msg_id'] = this.scheduleMessageData[i]['msg_id'];
			tempObj['no'] = counter;
			tempObj['subject'] = this.scheduleMessageData[i]['msg_subject'];
			tempObj['schedule_date'] = this.scheduleMessageData[i]['msg_created_date'];
			if (this.scheduleMessageData[i]['msg_receivers'] === 'Student') {
				tempObj['user_type'] = 'Student';
			} else if (this.scheduleMessageData[i]['msg_receivers'] === 'Parent') {
				tempObj['user_type'] = 'Parent';
			} else if (this.scheduleMessageData[i]['msg_receivers'] === 'Teacher') {
				tempObj['user_type'] = 'Teacher';
			} else if (this.scheduleMessageData[i]['msg_receivers'] === 'Staff') {
				tempObj['user_type'] = 'Staff';
			}
			tempObj['type'] = this.scheduleMessageData[i]['msg_type1'] ? this.scheduleMessageData[i]['msg_type1'] : '-'
			tempObj['send_to'] = this.scheduleMessageData[i]['msg_to'] ? this.scheduleMessageData[i]['msg_to'][0]['au_full_name'] : '-'
			tempObj['send_by'] = this.scheduleMessageData[i]['msg_created_by'] ? this.scheduleMessageData[i]['msg_created_by']['login_name'] : '';
			tempObj['attachment'] = this.scheduleMessageData[i]['msg_attachment'] ? this.scheduleMessageData[i]['msg_attachment'] : '';
			tempObj['status'] = this.scheduleMessageData[i]['status']['status_name'];
			tempObj['receiver_contact'] = this.scheduleMessageData[i]['msg_to'];
			tempObj['tpl_id'] = this.scheduleMessageData[i]['msg_template_id'];
			tempObj['tpl_title'] = this.scheduleMessageData[i]['tpl_title'];
			tempObj['body'] = this.scheduleMessageData[i]['msg_description'] ? this.scheduleMessageData[i]['msg_description'] : '';
			tempObj['user_data'] = this.scheduleMessageData[i]['msg_to'] ? this.scheduleMessageData[i]['msg_to'] : [];
			tempObj['msg_type'] = this.scheduleMessageData[i]['msg_type'] ? this.scheduleMessageData[i]['msg_type'] : '';
			tempObj['action'] =  this.scheduleMessageData[i];
			tempObj['msg_status'] = this.scheduleMessageData[i]['msg_status'] && this.scheduleMessageData[i]['msg_status'] && this.scheduleMessageData[i]['msg_status']['status_name'] ? this.scheduleMessageData[i]['msg_status']['status_name'] : '' ;
			
			this.USER_ELEMENT_DATA.push(tempObj);
			counter++;
		}
		this.dataSource = new MatTableDataSource(this.USER_ELEMENT_DATA);
		if (this.sort) {
			this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
			this.dataSource.sort = this.sort;
		}
		if (this.dataSource.paginator) {
			
		}
		this.dataSource.paginator.length = this.paginator.length = this.totalRecords;
			this.dataSource.paginator = this.paginator;
	}

	checkAllUserList($event) {
		this.selectedUserArr = [];
		if ($event.checked === true) {
			this.allUserSelectFlag = true;
			for (const item of this.USER_ELEMENT_DATA) {
				this.selectedUserArr.push({
					ns_id: item.ns_id
				});
			}
		} else {
			this.allUserSelectFlag = false;
		}
	}

	prepareSelectedRowData($event, item) {
		const findex = this.selectedUserArr.findIndex(f => f.ns_id === item);
		if (findex === -1) {
			this.selectedUserArr.push({ ns_id: item });
		} else {
			this.selectedUserArr.splice(findex, 1);
		}
	}

	


	applyFilterUser(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}


	editMessage(element) {
		var messageType = element.messageType;
		element.messageType = messageType;
		this.renderForm = {addMode:false, editMode:true, formData: element, viewMode : false};
		this.showComposeMessage = true;
	}

	deleteMessageFunc(element) {
		if(element) {
			this.updateMessage('delete',element);
		} else {
			this.updateMessage('delete');
		}
		
		// this.commonAPIService.updateMessage({ 'msg_id': element.msg_id, 'msg_status' : {status_id : '5' , status_name : 'delete' } }).subscribe((result: any) => {
		// 	if (result) {
		// 		this.commonAPIService.showSuccessErrorMessage('Message has been deleted Successfully', 'success');
		// 		this.getMessages();
		// 	} else {
		// 		this.commonAPIService.showSuccessErrorMessage('Error while deleting message', 'error');
		// 	}
		// });

	} 

	getMessage() {
		this.getMessages();
	}

	composeMessage() {
		this.showComposeMessage = true;
		var messageType = 'C';
		this.renderForm = {addMode:true, editMode:false, messageType: messageType, formData:'', viewMode : false,};
		
	}

	resetComposeMessage(messageType) {
		// console.log('fgfj');
		this.showComposeMessage = false;
		this.showViewMessage = false;
		// }
		this.getMessages();
		
	}

	previewImage(imgArray, index) {
		var updatedImageArr = [];
		for (var i=0; i<imgArray.length;i++) {
			updatedImageArr.push({file_url : imgArray[i]['imgUrl'], file_name : imgArray[i]['imgName'] })
		}

		this.dialogRef2 = this.dialog.open(PreviewDocumentComponent, {
			data: {
				images: updatedImageArr ? updatedImageArr : [],
				index: index
			},
			height: '70vh',
			width: '70vh'
		});
	}

	searchOk(event) {
	
	}

	deleteCancel() {
		
	}

	viewMessage(element) {
		this.showViewMessage = !this.showViewMessage;
		this.renderForm = {addMode:false, editMode:false, messageType: element.msg_type, formData:element, viewMode : false,};

	}
	updateMessage(action,element=null) {
		// console.log(this.selection.selected);
		let msg_status;
		if(action == 'approved') {
			msg_status = { status_id: '2', status_name: 'approved' };
		} else if(action == 'rejected') {
			msg_status = { status_id: '4', status_name: 'rejected' };
		} else if(action == 'delete') {
			msg_status = { status_id: '5', status_name: 'delete' };
		}		
		let jsonData = [];
		if(element) {
			let tempele:any= {};
			tempele['msg_id'] = element.action.msg_id;
			tempele['msg_status'] = msg_status;
			tempele['msg_to'] = element.action.msg_to;
			jsonData.push(tempele);
		} else {
			let isCommunication = true;
			this.selection.selected.forEach(element => {
				if(element.action.msg_type != 'C' && element.action.msg_type != 'notification') {
					isCommunication = false;
				}
			});
			if(isCommunication){
				this.selection.selected.forEach(element => {
					jsonData.push({ 'msg_id': element.action.msg_id, 'msg_status' : msg_status});
				});
			} else {
				this.commonAPIService.showSuccessErrorMessage('Please select communicaation message', 'error');
			}
			
		}
		if(jsonData.length > 0){			
			this.commonAPIService.updateMessage(jsonData).subscribe((result: any) => {
				if (result) {
					this.getMessages();
					this.commonAPIService.showSuccessErrorMessage('Message has been Updated Successfully', 'success');
				} else {
					this.commonAPIService.showSuccessErrorMessage('Error While Approving Message', 'error');
				}
			});
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please select message', 'error');
		}
	}
}

