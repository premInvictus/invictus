import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, ErrorStateMatcher } from '@angular/material';
import { Element } from './hostel-mapping.model';
import { SisService, CommonAPIService, FeeService } from '../../_services/index';
import { FormControl, NgForm, FormGroupDirective, FormGroup, FormBuilder } from '@angular/forms';
import { ConfirmValidParentMatcher } from '../../_validationclass/confirmValidParentMatcher.class';

@Component({
  selector: 'app-hostel-mapping',
  templateUrl: './hostel-mapping.component.html',
  styleUrls: ['./hostel-mapping.component.css']
})
export class HostelMappingComponent implements OnInit {

  buildingArray: any[] = [];
  roomArray: any[] = [];
  bedArray: any[] = [];
	@ViewChild('deleteModal') deleteModal;
	confirmValidParentMatcher = new ConfirmValidParentMatcher();
	editFlag = false;
	hostelconfigForm: FormGroup;
	constructor(private fbuild: FormBuilder, private sisService: SisService,
		private common: CommonAPIService,
		private feeService: FeeService) { }
	ELEMENT_DATA: Element[] = [];
	displayedColumns: string[] = ['srno', 'name', 'type', 'status', 'action'];
	dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	btnDisable = false;
	ngOnInit() {
    this.buildForm();
    this.getBuilding();
    this.getRoom();
    this.getBed();
		this.getHostelMapping();
	}
	buildForm() {
		this.hostelconfigForm = this.fbuild.group({
			hm_id: '',
			hm_building: '',
			hm_room: '',
      hm_bed: '',
      hm_group_id: '',
      hm_status: ''
		});
	}
	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}
	openDeleteDialog = (data) => this.deleteModal.openModal(data);
	deleteConfirm(value) {
		value.hc_status = '5';
		this.feeService.insertHostelConfig(value).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.common.showSuccessErrorMessage('Deleted Succesfully', 'success');
				this.getHostelMapping();
			} else {
				this.common.showSuccessErrorMessage(result.data, 'error');
			}
		});
  }
  getBuilding() {
    this.buildingArray = [];
    this.feeService.getHostelMapping({hc_type: 'building'}).subscribe((result: any) => {
			if (result.status === 'ok') {
        this.buildingArray = result.data;
      }
    });
  }
  getRoom() {
    this.roomArray = [];
    this.feeService.getHostelMapping({hc_type: 'room'}).subscribe((result: any) => {
			if (result.status === 'ok') {
        this.roomArray = result.data;
      }
    });
  }
  getBed() {
    this.bedArray = [];
    this.feeService.getHostelMapping({hc_type: 'bec'}).subscribe((result: any) => {
			if (result.status === 'ok') {
        this.bedArray = result.data;
      }
    });
  }
	getHostelMapping() {
		this.ELEMENT_DATA = [];
		this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
		this.feeService.getHostelMapping({}).subscribe((result: any) => {
			if (result.status === 'ok') {
				let pos = 1;
				for (const item of result.data) {
					this.ELEMENT_DATA.push({
						srno: pos,
						name: item.hc_name,
						type: item.hc_type,
						status: item.hc_status === '1' ? true : false,
						action: item
					});
					pos++;
				}
				this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
				this.dataSource.paginator = this.paginator;
				this.sort.sortChange.subscribe(() => this.paginator.pageSize = 0);
				this.dataSource.sort = this.sort;
			}
			this.hostelconfigForm.reset();
		});
  }
  
	submit() {
		if (!this.hostelconfigForm.valid) {
			this.btnDisable = false;
			this.hostelconfigForm.markAsDirty();
		} else {
			this.btnDisable = true;
			this.hostelconfigForm.markAsPristine();
			this.hostelconfigForm.updateValueAndValidity();
			this.hostelconfigForm.value['hc_status'] = '1';
			this.feeService.insertHostelConfig(this.hostelconfigForm.value).subscribe((result: any) => {
				this.btnDisable = false;
				if (result.status === 'ok') {
					this.common.showSuccessErrorMessage('Fines and Penalties Added Succesfully', 'success');
					this.getHostelMapping();
					this.hostelconfigForm.reset();
				} else {
					this.common.showSuccessErrorMessage(result.data, 'error');
					this.hostelconfigForm.reset();
				}
			});
		}
	}
	changeStatus($event, value: any) {
    if(value.hc_status === '1'){
      value.hc_status = '0';
    } else {
      value.hc_status = '1';
    }
		this.feeService.insertHostelConfig(value).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.common.showSuccessErrorMessage('Status Changed Succesfully', 'success');
				this.getHostelMapping();
			} else {
				this.common.showSuccessErrorMessage(result.data, 'error');
			}
		});
	}
	patchValue(value: any) {
		this.editFlag = true;
		this.hostelconfigForm.patchValue({
			hc_id: value.hc_id,
			hc_name: value.hc_name,
			hc_type: value.hc_type,
			hc_status: value.hc_status,
		});
	}
	update() {
		if (!this.hostelconfigForm.valid) {
			this.btnDisable = false;
			this.hostelconfigForm.markAsDirty();
		} else {
			this.btnDisable = true;
			this.hostelconfigForm.markAsPristine();
			this.hostelconfigForm.updateValueAndValidity();
			this.feeService.insertHostelConfig(this.hostelconfigForm.value).subscribe((result: any) => {
        this.btnDisable = false;
        this.editFlag = false;
				if (result.status === 'ok') {
					this.common.showSuccessErrorMessage('Fines and Penalties Updated Succesfully', 'success');
					this.getHostelMapping();
					this.hostelconfigForm.reset();
				} else {
					this.common.showSuccessErrorMessage(result.data, 'error');
					this.hostelconfigForm.reset();
				}
			});
		}
	}

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

}
