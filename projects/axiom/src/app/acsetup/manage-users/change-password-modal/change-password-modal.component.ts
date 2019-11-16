import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { QelementService } from '../../../questionbank/service/qelement.service';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.css']
})
export class ChangePasswordModalComponent implements OnInit {

  changeform: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<ChangePasswordModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbuild: FormBuilder,
    private qelementService: QelementService
    ) {}

  ngOnInit() {
    this.buildForm();
  }
  buildForm() {
    console.log(this.data);
		this.changeform = this.fbuild.group({
			au_password: '',
			au_login_id: this.data.au_login_id
		});

	}
  closeDialog(): void {
    this.dialogRef.close();
  }
  submit(){
    if(this.changeform.valid) {
      this.qelementService.changeUserStatus(this.changeform.value).subscribe(
        (result: any) => {
          if (result && result.status === 'ok') {
            this.dialogRef.close({changed: '1'});
          } else {
            this.dialogRef.close({changed: '0'});
          }
        },
      );
    }
  }

}
