import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { SisService, CommonAPIService, SmartService, FaService } from '../../_services';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-chart-of-accounts-create',
  templateUrl: './chart-of-accounts-create.component.html',
  styleUrls: ['./chart-of-accounts-create.component.css']
})
export class ChartOfAccountsCreateComponent implements OnInit {
  accountform: FormGroup;
  disabledApiButton = false;
  accountGroupArr:any[] = [];
  accountTypeArr:any[] = [];
  currentCoaId =0;

  constructor(
    public dialogRef: MatDialogRef<ChartOfAccountsCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fbuild: FormBuilder,
    private fb: FormBuilder,
		private commonAPIService: CommonAPIService,
		private faService:FaService
  ) { }

  ngOnInit() {
	  console.log('data--',this.data);
	this.buildForm();
	this.getAccountMaster();
  }
  buildForm() {
		this.accountform = this.fb.group({
			coa_code: '',
			coa_acc_name: '',
			coa_acc_group: '',
			coa_acc_type: '',
			coa_particulars: ''
		});

		if(this.data.formData && this.data.formData.coa_id) {
			this.currentCoaId =this.data.formData.coa_id;
			this.accountform.patchValue({
				coa_code: this.data.formData.coa_code,
				coa_acc_name: this.data.formData.coa_acc_name,
				coa_acc_group: this.data.formData.coa_acc_group.group_id,
				coa_acc_type: this.data.formData.coa_acc_type.acc_type_id,
				coa_particulars: this.data.formData.coa_particulars
			})
		}
  }

  getAccountMaster() {
	this.faService.getAccountMaster({}).subscribe((data:any)=>{
		if(data) {
			for(let i=0; i<data.length;i++) {
				if(data[i]['acc_state']==='acc_group') {
					this.accountGroupArr.push(data[i]);
				}
				if(data[i]['acc_state']==='acc_type') {
					this.accountTypeArr.push(data[i]);
				}
			}
		}
	});
  }
  closeDialog() {
		this.dialogRef.close();
  }
  reset() {
		this.accountform.reset();
  }

  getAccounTypeName(id) {
	  var accName;
	  for(var i=0; i<this.accountTypeArr.length;i++) {
		  if(this.accountTypeArr[i]['acc_id'] == id) {
			accName = this.accountTypeArr[i]['acc_name'];
			  break;
		  }
	  }
	  return accName;
  }

  getGroupName(id) {
	var accName;
	for(var i=0; i<this.accountGroupArr.length;i++) {
		if(this.accountGroupArr[i]['acc_id'] == id) {
		  accName = this.accountGroupArr[i]['acc_name'];
			break;
		}
	}
	return accName;
}



  submit() {
		if (this.accountform.valid) {
			this.disabledApiButton = true;

			var inputJson = {
				coa_id: this.currentCoaId ? this.currentCoaId : null,
				coa_code: this.accountform.value.coa_code,
				coa_acc_name: this.accountform.value.coa_acc_name,
				coa_acc_group: {group_id: this.accountform.value.coa_acc_group, "group_name":this.getGroupName(this.accountform.value.coa_acc_group)},
				coa_acc_type: { acc_type_id: this.accountform.value.coa_acc_type,"acc_type_name":this.getAccounTypeName(this.accountform.value.coa_acc_type)},
				coa_particulars: this.accountform.value.coa_particulars,
				coa_status:"active"
			};

			if (this.currentCoaId) {
				this.faService.updateChartOfAccount(inputJson).subscribe((data:any)=>{
					if (data) {
						this.dialogRef.close();
						this.commonAPIService.showSuccessErrorMessage("Account Updated Successfully", "success");
					} else {
						this.commonAPIService.showSuccessErrorMessage("Error While Updating Account", "error");
					}
				});
			} else {
				this.faService.createChartOfAccount(inputJson).subscribe((data:any)=>{
					if (data) {
						this.dialogRef.close();
						this.commonAPIService.showSuccessErrorMessage("Account Created Successfully", "success");
					} else {
						this.commonAPIService.showSuccessErrorMessage("Error While Creating Account", "error");
					}
				});
			}
			

		} else {
			this.commonAPIService.showSuccessErrorMessage('Please fill all required fields', 'error');
		}
	}
  

}
