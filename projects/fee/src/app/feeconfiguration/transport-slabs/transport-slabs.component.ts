import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { CommonAPIService, FeeService, SisService } from '../../_services/index';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-transport-slabs',
	templateUrl: './transport-slabs.component.html',
	styleUrls: ['./transport-slabs.component.scss']
})
export class TransportSlabsComponent implements OnInit, AfterViewInit {
	transportSlabs: FormGroup;
	classArray: any[] = [];
	sectionArray: any[] = [];
	transportSlabData: any[] = [];
	displayedColumns: string[] = [
		'counter',
		'slab_name',
		'fee_type',
		'fee_period',
		'fee_month',
		'calculation_type',
		'amount',
		'entry_date',
		'status',
		'action'
	];
	feetypeArray: any[] = [];
	genderArray: any[] = [];
	concessionruleArray: any[] = [];
	feeperiodArray: any[] = [];
	feemonthArray: any[] = [];
	feeotherArray: any[] = [];
	feeheadArray: any[] = [];
	calculationmethodArray: any[] = [];
	currentIndex = 0;
	TRANSPORT_SLAB_ELEMENT_DATA: any[] = [];
	slabStatus = '0';
	current_slab_id = 0;
	transportSlabDataSource = new MatTableDataSource<Element>(this.TRANSPORT_SLAB_ELEMENT_DATA);
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild('deleteModal') deleteModal;
	@ViewChild(MatSort) sort: MatSort;

	constructor(private fbuild: FormBuilder,
		private feeService: FeeService,
		private commonAPIService: CommonAPIService, private sisService: SisService,
		private router: Router,
		private route: ActivatedRoute) { }

	ngOnInit() {
		this.buildForm();
	}

	buildForm() {
		this.prepareForm();
		this.getCalculationMethods();
		this.getFeeTypes();
		this.getFeeMonths();
		this.getFeeOthers();
		this.getFeePeriods();
		this.getGender();
		this.getConcessionCategory();
		this.getTransportSlabs();

	}

	ngAfterViewInit() {
		this.transportSlabDataSource.paginator = this.paginator;
		this.transportSlabDataSource.sort = this.sort;
	}

	getFeeTypes() {
		this.feetypeArray = [];
		this.feeService.getFeeTypes({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.feetypeArray = result.data;
			}
		});
	}
	getFeeMonths() {
		this.feemonthArray = [];
		this.feeService.getFeeMonths({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.feemonthArray = result.data;
			}
		});
	}
	getFeeOthers() {
		this.feeotherArray = [];
		this.feeService.getFeeOthers({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.feeotherArray = result.data;
			}
		});
	}
	getFeePeriods() {
		this.feeperiodArray = [];
		this.feeService.getFeePeriods({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.feeperiodArray = result.data;
			}
		});
	}
	getCalculationMethods() {
		this.calculationmethodArray = [];
		this.feeService.getCalculationMethods({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.calculationmethodArray = result.data;
			}
		});
	}

	getGender() {
		this.genderArray = [];
		this.sisService.getGender().subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.genderArray = result.data;
			}
		});
	}

	getConcessionCategory() {
		this.concessionruleArray = [];
		this.feeService.getConcessionCategory({fcc_is_hostel_fee : 0}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.concessionruleArray = result.data;
			}
		});
	}

	getTransportSlabs() {
		this.transportSlabData = [];
		this.TRANSPORT_SLAB_ELEMENT_DATA = [];
		this.transportSlabDataSource = new MatTableDataSource(this.TRANSPORT_SLAB_ELEMENT_DATA);
		this.feeService.getSlabs({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.transportSlabData = result.data;
				this.prepareDataSource();
			} else {
				this.TRANSPORT_SLAB_ELEMENT_DATA = [];
				this.transportSlabDataSource = new MatTableDataSource(this.TRANSPORT_SLAB_ELEMENT_DATA);
			}
		}, (error) => {
			this.TRANSPORT_SLAB_ELEMENT_DATA = [];
			this.transportSlabDataSource = new MatTableDataSource(this.TRANSPORT_SLAB_ELEMENT_DATA);
		});
	}

	prepareDataSource() {
		this.transportSlabDataSource = new MatTableDataSource<Element>(this.TRANSPORT_SLAB_ELEMENT_DATA);
		let counter = 1;
		for (let i = 0; i < this.transportSlabData.length; i++) {
			const tempObj = {};
			tempObj['counter'] = counter;
			tempObj['ts_id'] = this.transportSlabData[i]['ts_id'];
			tempObj['slab_name'] = this.transportSlabData[i]['ts_name'];
			tempObj['fee_type'] = this.transportSlabData[i]['ft_name'];
			tempObj['fee_period'] = this.transportSlabData[i]['fp_name'];
			tempObj['fee_month'] = this.transportSlabData[i]['ts_fm_id'];
			tempObj['calculation_type'] = this.transportSlabData[i]['calm_name'];
			tempObj['amount'] = this.transportSlabData[i]['ts_cost'];
			tempObj['period'] = this.transportSlabData[i]['ts_name'];
			tempObj['other_category'] = this.transportSlabData[i]['fo_name'];
			tempObj['entry_date'] = this.transportSlabData[i]['ts_created_at'];
			tempObj['status'] = this.transportSlabData[i]['ts_status'];
			this.TRANSPORT_SLAB_ELEMENT_DATA.push(tempObj);
			counter++;
		}
		this.transportSlabDataSource = new MatTableDataSource(this.TRANSPORT_SLAB_ELEMENT_DATA);
		this.transportSlabDataSource.sort = this.sort;
		this.transportSlabDataSource.paginator = this.paginator;
		this.sort.sortChange.subscribe((() => this.paginator.pageIndex = 0));
	}

	prepareForm() {
		this.transportSlabs = this.fbuild.group({
			slab_name: '',
			slab_fee_type: '',
			slab_months: '',
			slab_fee_period: '',
			slab_calcualtion_method: '',
			slab_amount: '',
			slab_filter_gender: '',
			slab_filter_others: '',
			slab_filter_concession_category: '',
			slab_filter_hostel: ''
		});
	}

	patchFormValues() {
		const formData = this.transportSlabData[this.currentIndex];
		this.transportSlabs.patchValue({
			slab_name: formData && formData['ts_name'] ? formData['ts_name'] : '',
			slab_fee_type: formData && formData['ft_id'] ? formData['ft_id'] : '',
			slab_months: formData && formData['ts_fm_id'] ? JSON.parse(formData['ts_fm_id']) : [],
			slab_fee_period: formData && formData['ts_fp_id'] ? formData['ts_fp_id'] : '',
			slab_calcualtion_method: formData && formData['ts_calm_id'] ? formData['ts_calm_id'] : '',
			slab_amount: formData && formData['ts_cost'] ? formData['ts_cost'] : '',
			slab_filter_gender: formData && formData['ts_gender_id'] ? formData['ts_gender_id'] : '',
			slab_filter_others: formData && formData['ts_others'] ? formData['ts_others'] : '',
			slab_filter_concession_category: formData && formData['ts_csn_cat'] ? formData['ts_csn_cat'] : '',
			slab_filter_hostel: formData && formData['ts_hstl_id'] ? formData['ts_hstl_id'] : '',
		});

	}

	callSaveAPI(inputJson) {
		this.feeService.saveTransportSlab(inputJson).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
				this.slabStatus = '';
				this.current_slab_id = 0;
				this.resetForm();
				this.getTransportSlabs();
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}

	saveForm() {
		if (this.transportSlabs.valid) {
			let inputJson = {};
			inputJson = {
				ts_name: this.transportSlabs.value.slab_name,
				ts_ft_id: this.transportSlabs.value.slab_fee_type,
				ts_fm_id: JSON.stringify(this.transportSlabs.value.slab_months),
				ts_fp_id: this.transportSlabs.value.slab_fee_period,
				ts_class_id: this.transportSlabs.value.slab_class,
				ts_sec_id: this.transportSlabs.value.slab_section,
				ts_calm_id: this.transportSlabs.value.slab_calcualtion_method,
				ts_cost: this.transportSlabs.value.slab_amount,
				ts_gender_id: this.transportSlabs.value.slab_filter_gender,
				ts_others: this.transportSlabs.value.slab_filter_others,
				ts_csn_cat: this.transportSlabs.value.slab_filter_concession_category,
				ts_hstl_id: this.transportSlabs.value.slab_filter_hostel,
				ts_status: 1
			};
			if (this.current_slab_id) {
				inputJson['ts_id'] = this.current_slab_id;
				inputJson['ts_status'] = this.slabStatus;
			}
			this.callSaveAPI(inputJson);
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please Fill Required Fields', 'error');
		}
	}

	editTransportSlab(element) {
		this.slabStatus = element.status;
		this.current_slab_id = element.ts_id;
		this.currentIndex = parseInt(element.counter, 10) - 1;
		this.patchFormValues();
	}

	deleteTransportSlab(element) {
		this.slabStatus = '5';
		this.current_slab_id = element.ts_id;
		this.deleteModal.openModal(element);
	}

	changeStatus(element, event) {
		const inputJson = {};
		if (event.checked) {
			this.slabStatus = '1';
		} else {
			this.slabStatus = '0';
		}
		this.current_slab_id = element.ts_id;
		inputJson['ts_id'] = this.current_slab_id;
		inputJson['ts_status'] = this.slabStatus;
		inputJson['statusUpdate'] = true;
		this.callSaveAPI(inputJson);
	}

	resetForm() {
		this.slabStatus = '0';
		this.prepareForm();
	}

	applyFilter(filterValue: string) {
		this.transportSlabDataSource.filter = filterValue.trim().toLowerCase();
	}

	deleteConfirm(event) {
		const inputJson = {};
		inputJson['ts_id'] = this.current_slab_id;
		inputJson['ts_status'] = this.slabStatus;
		this.callSaveAPI(inputJson);
	}

	getMonthsList(monthData) {
		let monthList = '';
		let monthArr = [];
		if (monthData) {
			monthArr = JSON.parse(monthData);
			for (let i = 0; i < this.feemonthArray.length; i++) {
				if (monthArr && monthArr.indexOf(this.feemonthArray[i]['fm_id']) > -1) {
					monthList = monthList + this.feemonthArray[i]['fm_name'] + ', ';
				}
			}
			return monthList.replace(/,\s*$/, ' ');
		}
	}

}
