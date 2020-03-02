import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { CommonAPIService } from '../../_services';

@Component({
  selector: 'app-create-folder',
  templateUrl: './create-folder.component.html',
  styleUrls: ['./create-folder.component.css']
})
export class CreateFolderComponent implements OnInit {
  folderform: FormGroup;
  constructor(private fbuild: FormBuilder, private dialogRef: MatDialogRef<CreateFolderComponent>,
    private common: CommonAPIService) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.folderform = this.fbuild.group({
      'fname': ''
    });
  }
  closeDialog() {
    this.dialogRef.close();
  }
  add() {
    if (this.folderform.valid) {
      this.dialogRef.close({ fileName: this.folderform.value.fname });
    } else {
      this.common.showSuccessErrorMessage('Please enter file name', 'error');
    }
  }

}
