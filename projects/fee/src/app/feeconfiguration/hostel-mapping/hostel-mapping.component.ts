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
	hostelmappingForm: FormGroup;
	constructor(private fbuild: FormBuilder, private sisService: SisService,
		private common: CommonAPIService,
		private feeService: FeeService) { }
	ELEMENT_DATA: Element[] = [];
	displayedColumns: string[] = ['srno', 'building', 'room', 'bed', 'status', 'action'];
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
		this.hostelmappingForm = this.fbuild.group({
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
		const tvalue = value[0];
		const statusJson: any = {};
		statusJson.hm_group_id = tvalue.hm_group_id;
		statusJson.hm_status = '5';
		this.feeService.updateStatusHostelMapping(statusJson).subscribe((result: any) => {
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
    this.feeService.getHostelConfig({hc_type: 'building',hc_status: '1'}).subscribe((result: any) => {
			if (result.status === 'ok') {
        this.buildingArray = result.data;
      }
    });
  }
  getRoom() {
    this.roomArray = [];
    this.feeService.getHostelConfig({hc_type: 'room',hc_status: '1'}).subscribe((result: any) => {
			if (result.status === 'ok') {
        this.roomArray = result.data;
      }
    });
  }
  getBed() {
    this.bedArray = [];
    this.feeService.getHostelConfig({hc_type: 'bed',hc_status: '1'}).subscribe((result: any) => {
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
				const temp = result.data;
				let group_result = temp.reduce(function (r, a) {
				r[a.hm_group_id] = r[a.hm_group_id] || [];
				r[a.hm_group_id].push(a);
				return r;
				}, Object.create(null));
				console.log(group_result);
				if(group_result && Object.keys(group_result).length > 0) {	
					let pos = 0;		
					for(let key in group_result) {
						pos++;
						const eachelement: any = {};
						eachelement.hm_group_id = key;
						const tempBed: any[] = [];
						for(let item of group_result[key]) {
							eachelement.srno = pos;
							eachelement.building = item.building_name;
							eachelement.room = item.room_name;
							eachelement.status = item.hm_status;
							tempBed.push(item.bed_name);
						}
						eachelement.bed = tempBed;
						eachelement.action = group_result[key];
						this.ELEMENT_DATA.push(eachelement);
					}
				}
				this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
				this.dataSource.paginator = this.paginator;
				this.sort.sortChange.subscribe(() => this.paginator.pageSize = 0);
				this.dataSource.sort = this.sort;
			}
		});
  }
  
	submit() {
		if (!this.hostelmappingForm.valid) {
			this.btnDisable = false;
			this.hostelmappingForm.markAsDirty();
		} else {
			this.btnDisable = true;
			this.hostelmappingForm.markAsPristine();
			this.hostelmappingForm.updateValueAndValidity();
			this.hostelmappingForm.value['hm_status'] = '1';
			this.feeService.insertHostelMapping(this.hostelmappingForm.value).subscribe((result: any) => {
				this.btnDisable = false;
				if (result.status === 'ok') {
					this.common.showSuccessErrorMessage(result.message, 'success');
					this.getHostelMapping();
					this.hostelmappingForm.reset();
				} else {
					this.common.showSuccessErrorMessage(result.message, 'error');
					this.hostelmappingForm.reset();
				}
			});
		}
	}
	changeStatus($event, value_arr: any) {
		const value = value_arr[0];
		const statusJson: any = {};
		statusJson.hm_group_id = value.hm_group_id;
		if(value.hm_status === '1'){
			statusJson.hm_status = '0';
		} else {
			statusJson.hm_status = '1';
		}
		this.feeService.updateStatusHostelMapping(statusJson).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.common.showSuccessErrorMessage('Status Changed Succesfully', 'success');
				this.getHostelMapping();
			} else {
				this.common.showSuccessErrorMessage(result.data, 'error');
			}
		});
	}
	patchValue(value: any) {
		console.log(value);
		this.editFlag = true;
		const tempbed: any[] = [];
		value.forEach(element => {
			tempbed.push(element.hm_bed)
		});
		this.hostelmappingForm.patchValue({
			hm_building: value[0].hm_building,
			hm_room: value[0].hm_room,
			hm_bed: tempbed,
			hm_group_id: value[0].hm_group_id,
			hm_status: value[0].hm_status
		});
		console.log(this.hostelmappingForm.value);
	}
	update() {
		if (!this.hostelmappingForm.valid) {
			this.btnDisable = false;
			this.hostelmappingForm.markAsDirty();
		} else {
			this.btnDisable = true;
			this.hostelmappingForm.markAsPristine();
			this.hostelmappingForm.updateValueAndValidity();
			this.feeService.insertHostelMapping(this.hostelmappingForm.value).subscribe((result: any) => {
        this.btnDisable = false;
        this.editFlag = false;
				if (result.status === 'ok') {
					this.common.showSuccessErrorMessage(result.message, 'success');
					this.getHostelMapping();
					this.hostelmappingForm.reset();
				} else {
					this.common.showSuccessErrorMessage(result.message, 'error');
					this.hostelmappingForm.reset();
				}
			});
		}
	}

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

}
