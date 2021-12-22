import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FeeService, CommonAPIService } from '../../_services';

@Component({
  selector: 'app-fee-communication-modal',
  templateUrl: './fee-communication-modal.component.html',
  styleUrls: ['./fee-communication-modal.component.css']
})
export class FeeCommunicationModalComponent implements OnInit {

  constructor(private dialog: MatDialog, private fbuild: FormBuilder,
    private common: CommonAPIService,
    private feeServie: FeeService) { }
  inputData: any[] = [];
  @Input() smsMessage;
  wordLimit = 160;
  wordCount = 1;
  @Output() sendOk = new EventEmitter<any>();
  @Output() sendCancel = new EventEmitter<any>();
  communicationForm: FormGroup;
  enteredlength: any;
  currentUser: any = {};
  @ViewChild('smsFeeModal') smsFeeModal;
  dialogRef: MatDialogRef<FeeCommunicationModalComponent>;
  ngOnInit() {
  }

  openModal(data) {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.buildForm();
    this.inputData = data;
    this.dialogRef = this.dialog.open(this.smsFeeModal, {
      height: '50vh',
      width: '40%'
    });
  }
  buildForm() {
    this.communicationForm = this.fbuild.group({
      messageTo: '',
      messageSubject: '',
      messageBody: ''
    });
  }
  sendSMS() {
    if (this.inputData.length > 0 && this.communicationForm.valid) {
      this.feeServie.getSmsSendingDataUser({
        userData: this.inputData,
        currentUser: this.currentUser,
        messageDetails: this.communicationForm.value
      }).subscribe((res: any) => {
        if (res && res.status === 'ok') {
          this.common.showSuccessErrorMessage('Sms sent sucessfully', 'success');
          this.dialogRef.close({data : []})
        } else {
          this.common.showSuccessErrorMessage('Sms sending failed', 'error');
        }
      });
    } else {
      this.common.showSuccessErrorMessage('Please fill req fields', 'error');
    }
  }
  cancelSMS() {
    this.sendCancel.emit(this.inputData);
  }
  closeDialog() {
    this.dialogRef.close({ data: this.inputData });
  }
  deleteStudent(index) {
    this.inputData.splice(index, 1);
    if (this.inputData.length === 0) {
      this.closeDialog();
    }
  }
  subscribeModalChange() {
    return this.dialogRef;
  }
  getSMSCount($event) {
    this.enteredlength = $event.target.value.length;
    if (this.enteredlength <= this.wordLimit) {
      this.wordCount = 1;
    } else {
      if ($event.code !== 'Backspace' && this.enteredlength % 160 === 1) {
        this.wordCount++;
      }
      if ($event.code === 'Backspace' && this.enteredlength % 160 === 0) {
        this.wordCount--
      }
    }
  }
}
