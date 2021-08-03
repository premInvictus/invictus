import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { AxiomService, SisService, SmartService, CommonAPIService, ExamService, ProcesstypeExamService } from '../../_services';
@Component({
	selector: 'app-add-modal',
	templateUrl: './add-modal.component.html',
	styleUrls: ['./add-modal.component.scss']
})
export class AddModalComponent implements OnInit {
	inputData: any;
	@Input() addMessage;
	@Output() addOk = new EventEmitter<any>();
	@Output() addCancel = new EventEmitter<any>();
	dialogRef: MatDialogRef<AddModalComponent>;
	@ViewChild('addModal') addModal;
	generalRemarkForm: FormGroup;
	awardsForm: FormGroup;
	addForm: FormGroup;
	constructor(private dialog: MatDialog, private fbuild: FormBuilder, private sisService: SisService, private notif: CommonAPIService) { }

	buildAwardsForm(){
		this.awardsForm = this.fbuild.group({
			era_type: 'general',
			era_doj: new Date(),
			eaw_activity_name: '',
			eaw_level_of_interest: '',
			eaw_authority : '',
			eaw_event_level : '',
			eaw_teacher_remark: '',
			eaw_login_id: '',
			form_name : 'skills'
		});
	}

	buildRemarkForm(){
		this.generalRemarkForm = this.fbuild.group({
			era_type: 'general',
			era_doj: new Date(),
			era_aut_id: '',
			era_ar_id: '',
			era_teachers_remark: '',
			era_login_id: '',
			form_name : 'remarks'
		});
	}
	ngOnInit() {
	}

	openModal(data) {
		this.buildAwardsForm();
		this.buildRemarkForm();
		this.inputData = data;

		if (! (this.inputData && this.inputData.text)) {
			this.addMessage = 'Add ';
		}
		this.dialogRef = this.dialog.open(this.addModal, {
			'height': '40vh',
			'width': '90vh',
			position: {
				'top': '5%'
			}
		});
	}
	
	add(value) {
		if(value == 'skills'){
			this.addOk.emit(this.awardsForm);
		}else{
			this.addOk.emit(this.generalRemarkForm);
		}
	}

	log(value){
		console.log(value);
	}

	cancel() {
		this.addCancel.emit(this.inputData);
	}
	closeDialog() {
		this.dialogRef.close();
	}

}
