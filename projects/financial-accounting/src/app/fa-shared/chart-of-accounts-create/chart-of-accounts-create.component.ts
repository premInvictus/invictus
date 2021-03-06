import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { SisService, CommonAPIService, SmartService, FaService,FeeService } from '../../_services';
import { forEach } from '@angular/router/src/utils/collection';
import * as moment from 'moment';

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
  dependenciesType:any[] = [
	  {id:'internal',name:'Internal'},
	  {id:'external',name:'External'}
  ];
  dependancyeArr:any[] = [];
  paymentArr:any[] = [];
  salaryComponentArr:any[] = [];
  currentCoaId =0;
  today = moment();
  currentVcType = "Journel Entry";
  maxVCNumber = '';
  tempAccountGroup: any[] = [];
  feeHeadArr:any[] = [];
  locationArray:any[] = [];
  sessionId = '';
  constructor(
    public dialogRef: MatDialogRef<ChartOfAccountsCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fbuild: FormBuilder,
    private fb: FormBuilder,
		private commonAPIService: CommonAPIService,
		private faService:FaService,
		private feeService: FeeService
  ) {
	if (localStorage.getItem('session')) {
		this.sessionId = JSON.parse(localStorage.getItem('session'))['ses_id'];
		console.log('this.sessionId-->',this.sessionId);
	}
	
   }

  ngOnInit() {
	console.log('data--',this.data);
	this.buildForm();
	this.getAccountMaster();
	this.getVoucherTypeMaxId();
	this.checkFeeHead();
  }
  getVoucherTypeMaxId() {
	let param: any = {};
	param.vc_type = this.currentVcType;;
	
	this.faService.getVoucherTypeMaxId(param).subscribe((data:any)=>{
		if(data) {      
			this.maxVCNumber = data.vc_code; 
			
		}												
	});
}
  buildForm() {
		this.accountform = this.fb.group({
			coa_code: '',
			coa_acc_name: '',
			coa_acc_group: '',
			coa_acc_group_name:'',
			coa_acc_type: '',
			coa_particulars: '',
			dependencies_type: '',
			coa_dependencies: '',
			coa_dependency_local: '',
			opening_balance_date:moment(),
			opening_balance: '',
			opening_balance_type: ''
		});
		console.log('this.data.formData', this.data.formData);
		if(this.data.formData && this.data.formData.coa_id) {
			this.setFormValue();

		}
  }


  getOpeningBalanceData() {
	//   let result = {};
	//   console.log('this.data.formData.coa_opening_balance_data--',this.data.formData.coa_opening_balance_data)
	//   if (this.data.formData.coa_opening_balance_data) {
	// 	 this.data.formData.coa_opening_balance_data.map((acc,val)=>{	
	// 			console.log('acc[val]-->',acc,val)
	// 			if(Number(acc['opening_ses_id'])==Number(this.sessionId)) {
	// 				result= this.data.formData.coa_opening_balance_data[val] ;
	// 			}
	// 	},{})
	//   }
	//   return result;
	return this.data.formData.coa_opening_balance_data;
  }
  async setFormValue() {
	console.log('first')
	await this.getDependancy();
	console.log('last')
	this.currentCoaId =this.data.formData.coa_id;
	
	// let openingBalanceDataObject:any = this.getOpeningBalanceData();
	// console.log('openingBalanceDataObject--',openingBalanceDataObject)
	await this.faService.getChartsOfAccount({coa_id:this.data.formData.coa_id}).toPromise().then((result: any) => {
		let data = result;
		this.data.formData=result;
		let openingBalanceDataObject = data.coa_opening_balance_data.find(e => e.opening_ses_id == this.sessionId);
		this.accountform.patchValue({
			coa_code: data.coa_code,
			coa_acc_name: data.coa_acc_name,
			coa_acc_group: data.coa_acc_group.group_id,
			coa_acc_group_name: data.coa_acc_group.group_name,
			coa_acc_type: data.coa_acc_type.acc_type_id,
			coa_particulars: data.coa_particulars,
			coa_dependency_local: data.coa_dependency_local,
			dependencies_type: data.dependencies_type,
			opening_balance_date: (openingBalanceDataObject ? moment(openingBalanceDataObject.opening_balance_date) : this.today),
			opening_balance: (openingBalanceDataObject ? openingBalanceDataObject.opening_balance : 0),
			opening_balance_type: (openingBalanceDataObject ? openingBalanceDataObject.opening_balance_type : ''),
		});
		this.today = (openingBalanceDataObject ? moment(openingBalanceDataObject.opening_balance_date) : this.today);
		console.log('this.accountform', this.accountform.value)
		this.setDependancyValue();
    });

  }
  async getDependancy(){
	this.locationArray = [];
	this.dependancyeArr.push(
		{id:'ca-1', name: 'Cash Collection'},
		{id:'ca-9', name: 'Cash Payment'},
		{id:'ca-2', name: 'Salary A/C'},
		{id:'ca-3', name: 'Arrear'},
		{id:'ca-4', name: 'Advance'},
		{id:'ca-5', name: 'Salary Payable'},
		// {id:'ca-6', name: 'ESI'},
		{id:'ca-10', name: 'TA'},
		{id:'ca-7', name: 'TDS'},
		{id:'ca-8', name: 'Gratuity'},
		{id:'fr-1', name: 'Fee Receivable'},
		{id:'adj-1', name: 'Fee Adjustment'},
		{id:'wl-1', name: 'Wallet'},	
		// {id:'st-1', name: 'Store'},	
	);
	await this.faService.getBanks({}).toPromise().then((result: any) => {
		if(result && result.status == 'ok') {
			this.paymentArr = result.data;
			for (const item of result.data) {
				this.dependancyeArr.push(
					{id:'pm-c-'+item.bnk_id, name: item.bank_name+" Collection", alias: item.bank_name},
					{id:'pm-p-'+item.bnk_id, name: item.bank_name+" Payment", alias: item.bank_name}
				)
			}
		}
	})
	await this.faService.getSalaryComponent().toPromise().then((result: any) => {
		if(result) {
			this.salaryComponentArr = result;
			for (const item of result) {
				if(item.sc_type.type_id == '2' && item.sc_status=="1"){ //Deducation
					this.dependancyeArr.push(
						{id:'sc-'+item.sc_id, name: item.sc_name}
					);
				}
			}
		}
	})
	await this.feeService.getLocation({}).subscribe((result: any) => {
		if (result) {
			this.locationArray = result;
			for (const item of result) {
				if(item.location_status=="1"){ //Deducation
					this.dependancyeArr.push(
						{id:'st-'+item.location_id, name: item.location_name}
					);
				}
			}
		}
	});
	console.log('middle')
  }
  checkFeeHead() {
	//this.dependancyeArr = [];
	this.faService.getFeeHead({}).subscribe((result: any) => {
		if(result) {
			console.log('result-', result);
			this.feeHeadArr = result.data;
			this.dependancyeArr.push({id:'fh-0', name:'Transport Fee'});
			this.dependancyeArr.push({id:'fh--1', name:'Fine'});
			for (const item of result.data) {
				
					this.dependancyeArr.push(
						{id:'fh-'+item.fh_id, name: item.fh_name}
					);
					
				
			}
		}
	});
	console.log('this.depeb', this.dependancyeArr);
  }
  setDependancyValue(){
	console.log('this.dependancyeArr',this.dependancyeArr);
	console.log('this.accountform.value.coa_dependency_local',this.accountform.value.coa_dependency_local);
	if(this.accountform.value.coa_dependency_local){
		console.log(this.accountform.value.coa_dependency_local)
		const temparr = this.accountform.value.coa_dependency_local.split('-');
		console.log(temparr);
		console.log(this.paymentArr);
		if(temparr.length == 2 || temparr.length == 3){
			const tempjson: any = {};
			const temp = this.dependancyeArr.find(e => e.id == this.accountform.value.coa_dependency_local);
			console.log('temp',temp);
			coa_dependencies: [{ dependancy_id : 5, dependency_local_id: "pm-5", dependenecy_component: "payment_mode", "dependency_name":"Corpration Bank" }]
			if(temparr[0] == 'pm' && temparr.length === 2 ){				
				tempjson.dependancy_id = temparr.length === 2 ? temparr[1] : temparr[2];
				tempjson.dependency_local_id = this.accountform.value.coa_dependency_local;
				tempjson.dependenecy_component = 'payment_mode';
				tempjson.dependency_name = temp.name;
				return [tempjson];
			} if(temparr[0] == 'pm' && temparr.length === 3 &&  temparr[1] === 'c'){				
				tempjson.dependancy_id = temparr.length === 2 ? temparr[1] : temparr[2];
				tempjson.dependency_local_id = this.accountform.value.coa_dependency_local;
				tempjson.dependenecy_component = 'payment_mode_collection';
				tempjson.dependency_name = temp.name;
				return [tempjson];
			} if(temparr[0] == 'pm' && temparr.length === 3 &&  temparr[1] === 'p'){				
				tempjson.dependancy_id = temparr.length === 2 ? temparr[1] : temparr[2];
				tempjson.dependency_local_id = this.accountform.value.coa_dependency_local;
				tempjson.dependenecy_component = 'payment_mode_payment';
				tempjson.dependency_name = temp.name;
				return [tempjson];
			} else if(temparr[0] == 'sc'){
				tempjson.dependancy_id = temparr[1];
				tempjson.dependency_local_id = this.accountform.value.coa_dependency_local;
				tempjson.dependenecy_component = 'salary_component';
				tempjson.dependency_name = temp.name;
				return [tempjson];
			} else if(temparr[0] == 'ca'){
				tempjson.dependancy_id = temparr[1];
				tempjson.dependency_local_id = this.accountform.value.coa_dependency_local;
				tempjson.dependenecy_component = 'cash';
				tempjson.dependency_name = temp.name;
				return [tempjson];
			} else if(temparr[0] == 'fh'){
				tempjson.dependancy_id = temparr[1];
				tempjson.dependency_local_id = this.accountform.value.coa_dependency_local;
				tempjson.dependenecy_component = 'fee_head';
				tempjson.dependency_name = temp.name;
				return [tempjson];
			} else if(temparr[0] == 'fr'){
				tempjson.dependancy_id = temparr[1];
				tempjson.dependency_local_id = this.accountform.value.coa_dependency_local;
				tempjson.dependenecy_component = 'fee_receivable';
				tempjson.dependency_name = temp.name;
				return [tempjson];
			} else if(temparr[0] == 'adj'){
				tempjson.dependancy_id = temparr[1];
				tempjson.dependency_local_id = this.accountform.value.coa_dependency_local;
				tempjson.dependenecy_component = 'fee_invoice_includes_adjustments';
				tempjson.dependency_name = temp.name;
				return [tempjson];
			} else if(temparr[0] == 'wl'){
				tempjson.dependancy_id = temparr[1];
				tempjson.dependency_local_id = this.accountform.value.coa_dependency_local;
				tempjson.dependenecy_component = 'wallet';
				tempjson.dependency_name = temp.name;
				return [tempjson];
			} else if(temparr[0] == 'st'){
				tempjson.dependancy_id = temparr[1];
				tempjson.dependency_local_id = this.accountform.value.coa_dependency_local;
				tempjson.dependenecy_component = 'store';
				tempjson.dependency_name = temp.name;
				return [tempjson];
			}
		}
	}
  }
	setAccountGroup(item) {
		console.log('item---',item);
		this.accountform.patchValue({
			coa_acc_group: item.acc_id
		})
	}
  	getAccountGroup(event = null) {
		this.accountGroupArr = [];
		this.tempAccountGroup = [];
		if (event) {
			console.log('key', event.keyCode);
			if (event.keyCode != 38 && event.keyCode != 40) {
				let param: any = {};
				if (event) {
					param.acc_name = event.target.value
				}
				this.faService.getAccountMaster(param).subscribe((data: any) => {
					if (data) {
						for(let i=0; i<data.length;i++) {
							if(data[i]['acc_state']==='acc_group') {
								this.accountGroupArr.push(data[i]);
								this.tempAccountGroup.push(data[i]);
							}
						}
					}
				})
			}
		} else {
			let param: any = {};
			this.faService.getAccountMaster({}).subscribe((data: any) => {
				if (data) {
					for(let i=0; i<data.length;i++) {
						if(data[i]['acc_state']==='acc_group') {
							this.accountGroupArr.push(data[i]);
							this.tempAccountGroup.push(data[i]);
						}
					}
				}
			})
		}
	}
  getAccountMaster() {
	this.tempAccountGroup = [];
	this.faService.getAccountMaster({}).subscribe((data:any)=>{
		if(data) {
			for(let i=0; i<data.length;i++) {
				if(data[i]['acc_state']==='acc_group') {
					this.accountGroupArr.push(data[i]);
					this.tempAccountGroup.push(data[i]);
				}
				if(data[i]['acc_state']==='acc_type') {
					this.accountTypeArr.push(data[i]);
				}
			}
			
			if(this.accountGroupArr.length > 0) {
				this.tempAccountGroup = this.accountGroupArr;
				// console.log(this.accountGroupArr);
				// this.accountGroupArr.forEach(element => {
					
				// 	if(element.acc_parent == '0') {
				// 		//console.log(element);
				// 		var childSub: any[] = [];
				// 		for (const item of this.accountGroupArr) {
				// 		  if (element.acc_id == item.acc_parent) {
				// 			childSub.push(item);
				// 		  }
				// 		}
				// 		element.childSub = childSub;
				// 		this.tempAccountGroup.push(element);
				// 	  }
				// });
			}
			console.log(this.tempAccountGroup);
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
	getParentName(id) {
		var accName = '';
		if(id){
			const temp1 = this.accountGroupArr.find(e => e.acc_id == id);
			if(temp1.acc_parent !=  0 && temp1.acc_parent != ''){
				let tempname = this.accountGroupArr.find(e => e.acc_id == temp1.acc_parent);
				if(tempname){
					accName = tempname.acc_name
				}			
			}
		}
		return accName;
	}



  submit() {
		if (this.accountform.valid) {
			this.disabledApiButton = true;
			// var oDate = this.accountform.value.opening_balance_date ? (this.accountform.value.opening_balance_date) : (this.accountform.value.opening_balance_date = this.today);
			console.log('date ',this.accountform.value.opening_balance_date);
			var oDate = this.accountform.value.opening_balance_date.format("YYYY-MM-DD");
			console.log('oDate--', oDate);

			let result = {};
			// console.log('this.data.formData.coa_opening_balance_data--',this.data.formData.coa_opening_balance_data)

			var inputJson = {
				coa_id: this.currentCoaId ? this.currentCoaId : null,
				coa_code: this.accountform.value.coa_code,
				coa_acc_name: this.accountform.value.coa_acc_name,
				coa_acc_group: {group_id: this.accountform.value.coa_acc_group, "group_name":this.getGroupName(this.accountform.value.coa_acc_group),group_parent_name :this.getParentName(this.accountform.value.coa_acc_group)},
				
				coa_acc_type: { acc_type_id: this.accountform.value.coa_acc_type,"acc_type_name":this.getAccounTypeName(this.accountform.value.coa_acc_type)},
				coa_particulars: this.accountform.value.coa_particulars,
				coa_status:"active",
				dependencies_type: this.accountform.value.dependencies_type,
				coa_dependency_local: this.accountform.value.coa_dependency_local,
				coa_dependencies: this.setDependancyValue(),
				// coa_opening_balance_data: {
				// 	'opening_balance': (this.accountform.value.opening_balance ? Number(this.accountform.value.opening_balance) : 0),
				// 	'opening_balance_date': oDate,
				// 	'opening_balance_month' : Number(this.accountform.value.opening_balance_date.format("MM")),
				// 	'opening_balance_year': Number(this.accountform.value.opening_balance_date.format("YYYY")),
				// 	'opening_balance_type' : this.accountform.value.opening_balance_type
				// }
			};
			if (this.data.formData && this.data.formData.coa_opening_balance_data && this.currentCoaId) {
				let flag =0;
				this.data.formData.coa_opening_balance_data.map((acc,val)=>{
					   if(acc['opening_ses_id']==Number(this.sessionId)) {
						   result= this.data.formData.coa_opening_balance_data[val] ;						   
						   this.data.formData.coa_opening_balance_data[val]['opening_balance']= (this.accountform.value.opening_balance ? Number(this.accountform.value.opening_balance) : 0);
						   this.data.formData.coa_opening_balance_data[val]['opening_balance_date']= oDate;
						   this.data.formData.coa_opening_balance_data[val]['opening_balance_month'] = Number(this.accountform.value.opening_balance_date.format("MM"));
						   this.data.formData.coa_opening_balance_data[val]['opening_balance_year']= Number(this.accountform.value.opening_balance_date.format("YYYY"));
						   this.data.formData.coa_opening_balance_data[val]['opening_balance_type']= this.accountform.value.opening_balance_type;	
						   flag =1;		
						   return false;			
					   }
			   },{})
			   if (!flag) {
				this.data.formData.coa_opening_balance_data.push({
					'opening_balance': (this.accountform.value.opening_balance ? Number(this.accountform.value.opening_balance) : 0),
					'opening_balance_date': oDate,
					'opening_balance_month' : Number(this.accountform.value.opening_balance_date.format("MM")),
					'opening_balance_year': Number(this.accountform.value.opening_balance_date.format("YYYY")),
					'opening_balance_type' : this.accountform.value.opening_balance_type,
					'opening_ses_id' : Number(this.sessionId)

				});
			   }
			   inputJson['coa_opening_balance_data'] = this.data.formData.coa_opening_balance_data;
			 } else {
				 inputJson['coa_opening_balance_data'] = {};
				 inputJson['coa_opening_balance_data'] = [{
					'opening_balance': (this.accountform.value.opening_balance ? Number(this.accountform.value.opening_balance) : 0),
					'opening_balance_date': oDate,
					'opening_balance_month' : Number(this.accountform.value.opening_balance_date.format("MM")),
					'opening_balance_year': Number(this.accountform.value.opening_balance_date.format("YYYY")),
					'opening_balance_type' : this.accountform.value.opening_balance_type,
					'opening_ses_id' : Number(this.sessionId)
				}];
			 }
			 
 
			console.log(inputJson)
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
				var currentAccId;
				this.faService.createChartOfAccount(inputJson).subscribe((data:any)=>{
				if (data) {
					console.log('data--', data);
					currentAccId = data.coa_id;
					console.log('this.accountform.value--', this.accountform.value);
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

	setDate() {
		// console.log('imgArray--',this.accountform.value.opening_balance_date, this.accountform.value.opening_balance_date.format("YYYY-MM-DD"));
		// this.today = this.accountform.value.opening_balance_date.format("YYYY-MM-DD");
		
	}
  

}
