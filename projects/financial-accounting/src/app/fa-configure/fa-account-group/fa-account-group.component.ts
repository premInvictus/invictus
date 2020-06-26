import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, ErrorStateMatcher } from '@angular/material';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { SisService, CommonAPIService,FaService } from '../../_services/index';
@Component({
	selector: 'app-fa-account-group',
	templateUrl: './fa-account-group.component.html',
	styleUrls: ['./fa-account-group.component.css']
})
export class AccountGroupComponent implements OnInit {

	@ViewChild('deleteModalRef') deleteModal;
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	deleteMessage: any = 'Are You Sure you want to Delete...?';
	locationForm: FormGroup;
	configValue: any;
	currentUser: any;
	session: any;
	accountGroupArr: any[] = [];
	locationTypeArray: any[] = [];
	CONFIG_ELEMENT_DATA: ConfigElement[] = [];
	configDataSource: any = new MatTableDataSource<ConfigElement>(this.CONFIG_ELEMENT_DATA);
	displayedColumns: any[] = ['acc_id', 'acc_name', 'acc_parent','order', 'status', 'action'];
	configFlag = false;
	editFlag = false;
	currentLocationId: any;
	disabledApiButton = false;
	constructor(
		private fbuild: FormBuilder,
		public commonAPIService: CommonAPIService,
		public sisService: SisService,
		public faService: FaService
	) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.session = JSON.parse(localStorage.getItem('session'));
	}

	ngOnInit() {
		this.buildForm();
		this.getAccountMaster();
	}

	ngAfterViewInit() {
		this.configDataSource.sort = this.sort;
		this.configDataSource.paginator = this.paginator;
	}
	openDeleteDialog(data) {
		console.log('data--', data);
		this.deleteModal.openModal(data);
	}

	buildForm() {
		this.locationForm = this.fbuild.group({
			acc_id: '',
			acc_name: '',
			acc_parent: '',
			acc_parent_name: '',
			order: '',
			status:'',
			acc_state: ''
		});
	}
	getAccountMaster() {
		this.accountGroupArr=[];
		this.faService.getAccountMaster({}).subscribe((data:any)=>{
			if(data) {
				this.accountGroupArr=data;
				let element: any = {};
				this.CONFIG_ELEMENT_DATA = [];
				this.configDataSource = new MatTableDataSource<ConfigElement>(this.CONFIG_ELEMENT_DATA);
				let pos = 1;
				for (const item of this.accountGroupArr) {
					element = {
						srno: pos,
						acc_id: item.acc_id,
						acc_name: item.acc_name,
						acc_parent: item.acc_parent ? this.accountGroupArr.find(e => e.acc_id == item.acc_parent).acc_name : '',
						order: item.order,
						status: item.status,
						action: item
					};
					this.CONFIG_ELEMENT_DATA.push(element);
					pos++;

				}
				this.configDataSource = new MatTableDataSource<ConfigElement>(this.CONFIG_ELEMENT_DATA);
				this.configDataSource.paginator = this.paginator;
				if (this.sort) {
					this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
					this.configDataSource.sort = this.sort;
				}
			}
		});
	  }

	save() {
		if (this.locationForm.valid) {
			this.disabledApiButton = true;
			
			this.locationForm.patchValue({
				acc_state: 'acc_group'
			})
			if(this.locationForm.value.status == ''){
				this.locationForm.patchValue({
					status: '1'
				})
			}
			if(this.locationForm.value.order == ''){
				this.locationForm.patchValue({
					order: 1
				})
			}
			if(this.locationForm.value.acc_parent && this.locationForm.value.acc_parent != 0){
				this.locationForm.patchValue({
					acc_parent_name: this.accountGroupArr.find(e => e.acc_id == this.locationForm.value.acc_parent).acc_name
				})
			}
			if (this.locationForm.value.acc_id) {
				this.faService.updateAccountMaster(this.locationForm.value).subscribe((result) => {
					this.disabledApiButton = false;
					if (result) {
						this.commonAPIService.showSuccessErrorMessage('Account Updated Successfully', 'success');
						this.resetForm();
						this.getAccountMaster();
					} else {
						this.commonAPIService.showSuccessErrorMessage('Error While Updating Account', 'error');
					}
				});
			} else {
				this.disabledApiButton = false;
				this.faService.insertAccountMaster(this.locationForm.value).subscribe((result) => {
					if (result) {
						this.commonAPIService.showSuccessErrorMessage('Account Saved Successfully', 'success');
						this.resetForm();
						this.getAccountMaster();
					} else {
						this.commonAPIService.showSuccessErrorMessage('Error While Saving Account', 'error');
					}
				});
			}
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please Fill Required Fields', 'error');
		}

	}

	edit(element) {
		console.log(element);
		this.editFlag = true;
		this.locationForm.patchValue({
			acc_id: element.acc_id ? element.acc_id : 0,
			acc_name: element.acc_name ? element.acc_name : '',
			acc_parent: element.acc_parent ? element.acc_parent : 0,
			order: element.order ? element.order : 1
		});
	}

	toggleStatus(element) {
		this.editFlag = true;
		this.locationForm.patchValue({
			acc_id: element.acc_id ? element.acc_id : 0,
			acc_name: element.acc_name ? element.acc_name : '',
			acc_parent: element.acc_parent ? element.acc_parent : 0,
			status: element.status === '1' ? '0' : '1',
			order: element.order ? element.order : 1
		});

		this.save();
	}

	applyFilterLocation(filterValue: string) {
		this.configDataSource.filter = filterValue.trim().toLowerCase();
	}

	

	deleteLocation(data) {
		if (this.currentLocationId) {
			this.currentLocationId['status'] = 'delete';
			this.faService.updateAccountMaster(this.currentLocationId).subscribe((res: any) => {
				if (res) {
					this.commonAPIService.showSuccessErrorMessage(res.message, res.status);
					this.getAccountMaster();
				} else {
					this.commonAPIService.showSuccessErrorMessage(res.message, res.status);
				}
			})
		}
	}

	deleteLocationModel(acc_id) {
		this.currentLocationId = acc_id;
	}

	resetForm() {
		this.locationForm.reset();
		this.editFlag = false;
	}
	deleteComCancel() {

	}
	isExistUserAccessMenu(mod_id) {
		return this.commonAPIService.isExistUserAccessMenu(mod_id);
	}

}

export class ConfigElement {
	srno: number;
	acc_id: string;
	acc_name: string;
	acc_parent: string;
	order: string;
	status:string;
	action: any;
}
