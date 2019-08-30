import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService, ExamService } from '../../_services';
import { MatTableDataSource, MatPaginator, MatSort, ErrorStateMatcher } from '@angular/material';
import { ConfigElement } from './setup.model';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { ptBrLocale } from 'ngx-bootstrap';

@Component({
	selector: 'app-setup',
	templateUrl: './setup.component.html',
	styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {


	@ViewChild('deleteModal') deleteModal;
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	deleteMessage: any = 'Are You Sure you want to Delete...?';
	formGroupArray: any[] = [];
	configValue: any;
	currentUser: any;
	session: any;
	param: any = {};
	classArray: any[];
	parentSubArray: any[];
	secArray: any[];
	topicArray: any[];
	detailArray: any[];
	systemInfoForm: FormGroup;
	setupUpdateFlag = false;
	editFlag = false;
	finaldivflag = true;
	showConfigForm = '';
	subArray: any[];
	file: any;
	finalXlsTopicArray: any[] = [];
	gradeDataFrmArr: any[] = [];
	gradeSetArray: any[] = [];
	remarkSetArray: any[] = [];
	examActivityCategoryArr: any[] = [];
	examActivityTypeArr: any[] = [];
	remarkToneArray: any[] = [{'remark_tone_id':'1', 'remark_tone_name': 'Commendatory'}, {'remark_tone_id':'2', 'remark_tone_name': 'Neutal'}, {'remark_tone_id':'3', 'remark_tone_name': 'Adverse'},];
	pointTypeArray: any[] = [{ 'pt_id': '1', 'pt_name': 'Point' }, { 'pt_id': '2', 'pt_name': 'Range' }];
	tiersArray: any[] = [{ 'tier_id': '1', 'tier_name': 1 }, { 'tier_id': '2', 'tier_name': 2 }, { 'tier_id': '3', 'tier_name': 3 }, { 'tier_id': '4', 'tier_name': 4 }, { 'tier_id': '5', 'tier_name': 5 }, { 'tier_id': '6', 'tier_name': 6 }, { 'tier_id': '7', 'tier_name': 7 }, { 'tier_id': '8', 'tier_name': 8 }, { 'tier_id': '9', 'tier_name': 9 }, { 'tier_id': '10', 'tier_name': 10 }];
	rangeArray: any[] = [];
	XlslArray: any[] = [];
	arrayBuffer: any;
	CONFIG_ELEMENT_DATA: ConfigElement[] = [];
	configDataSource = new MatTableDataSource<ConfigElement>(this.CONFIG_ELEMENT_DATA);
	displayedColumns: any[] = [];
	firstHeaderArray: any[] = ['Exam Name', 'Sub Exam Name', 'Grade Set Name', 'Remark Name', 'Activity Name', 'Report Card Name'];
	secondHeaderArray: any[] = ['Order', 'Order', 'Order', 'Order', 'Order', 'Order'];
	configFlag = false;


	constructor(
		private fbuild: FormBuilder,
		private smartService: SmartService,
		public commonService: CommonAPIService,
		public axiomService: AxiomService,
		public sisService: SisService,
		public examService: ExamService,
	) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.session = JSON.parse(localStorage.getItem('session'));
	}

	ngOnInit() {
		this.buildForm();
		// this.getClass();
		// this.getDetailsCdpRelation();
	}

	ngAfterViewInit() {
		this.configDataSource.sort = this.sort;
		this.configDataSource.paginator = this.paginator;
	}
	openDeleteDialog = (data) => this.deleteModal.openModal(data);

	buildForm() {
		// this.systemInfoForm = this.fbuild.group({
		// 	class_id: '',
		// 	no_of_day: '',
		// 	no_of_period: '',
		// 	class_name: '',
		// 	sec_name: '',
		// 	sub_name: '',
		// 	sub_id: '',
		// 	topic_name: '',
		// 	topic_id: '',
		// 	sub_topic_name: '',
		// 	sec_id: ''
		// });

		this.formGroupArray = [
			// for exam setup
			{
				formGroup: this.fbuild.group({
					topic_id: '',
					topic_class_id: '',
					topic_sub_id: '',
					topic_name: '',
					topic_order: '',
					topic_status: ''
				})
			},
			{ // for sub exam setup
				formGroup: this.fbuild.group({
					egs_number: '',
					egs_name: '',
					egs_point_type: '',
					egs_no_of_tiers: '',
					egs_grade_data: '',
					egs_description: '',
					egs_status: ''
				})
			},
			{ // for exam grade setup
				formGroup: this.fbuild.group({
					egs_number: '',
					egs_name: '',
					egs_point_type: '',
					egs_no_of_tiers: '',
					egs_grade_data: '',
					egs_description: '',
					egs_status: ''
				})
			},
			{ // for exam remark setup
				formGroup: this.fbuild.group({
					ers_id: '',
					ers_name: '',
					ers_egs_number: '',
					ers_remark_type: '',
					ers_remark_description: '',
					ers_remark_tone: '',
					ers_status: ''
				})
			},
			{ // for exam activity setup
				formGroup: this.fbuild.group({
					ea_id: '',
					ea_name: '',
					ea_category_id: '',
					ea_type_id: '',
					ea_description: '',
					ea_status: ''
				})
			},
			{ // for report card setup
				formGroup: this.fbuild.group({
					ea_id: '',
					ea_name: '',
					ea_category_id: '',
					ea_type_id: '',
					ea_description: '',
					ea_status: ''
				})
			}];
	}
	// delete dialog open modal function
	deleteSetupList(j) {
		this.param.indexj = j;
		this.param.text = 'Delete';
		this.deleteModal.openModal(this.param);
	}

	getExamActivityCategory(that) {
		that.examService.getExamActivityCategory().subscribe((result: any) => {
			if (result.status === 'ok') {
				that.examActivityCategoryArr = result.data;
			} else {
				that.examActivityCategoryArr = [];
			}
		});
	}

	getExamActivityType(that) {
		that.examService.getExamActivityType().subscribe((result: any) => {
			if (result.status === 'ok') {
				that.examActivityTypeArr = result.data;
			} else {
				that.examActivityTypeArr = [];
			}
		});
	}

	getExam(that) {

	}

	getSubExam(that) {

	}

	getReportCardSetup(that) {

	}

	getExamGradeSetup(that) {
		that.gradeSetArray = [];
		that.CONFIG_ELEMENT_DATA = [];
		that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
		that.examService.getGradeSet().subscribe((result: any) => {
			if (result.status === 'ok') {
				that.gradeSetArray = result.data;
				if (that.configValue === '3') {
					let pos = 1;
					for (const item of result.data) {
						that.CONFIG_ELEMENT_DATA.push({
							position: pos,
							name: item.egs_name,
							point_type_id: item.egs_point_type,
							no_of_tiers: item.egs_no_of_tiers,
							grade_name: item.egs_grade_name,
							grade_value: item.egs_grade_value,
							range_start: item.egs_range_start,
							range_end: item.egs_range_end,
							grade_set_description: item.egs_description,
							order: item.class_order,
							action: item
						});
						pos++;
					}
					that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
					that.configDataSource.paginator = that.paginator;
					that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
					that.configDataSource.sort = that.sort;
				}
			} else {
				that.gradeSetArray = [];
			}
		});
	}

	getExamRemarkSetup(that) {
		that.remarkSetArray = [];
		that.CONFIG_ELEMENT_DATA = [];
		that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
		that.examService.getRemarkSet().subscribe((result: any) => {
			if (result.status === 'ok') {
				that.remarkSetArray = result.data;
				if (that.configValue === '4') {
					let pos = 1;
					for (const item of result.data) {
						that.CONFIG_ELEMENT_DATA.push({
							position: pos,
							name: item.ers_name,
							remark_grade_name: item.egs_name,
							remark_type: item.ers_remark_type,
							remark_description: item.ers_remark_description,
							remark_tone: item.ers_remark_tone,
							action: item
						});
						pos++;
					}
					that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
					that.configDataSource.paginator = that.paginator;
					that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
					that.configDataSource.sort = that.sort;
				}
			} else {
				that.remarkSetArray = [];
			}
		});
	}

	getExamActivitySetup(that) {
		that.examActivityArray = [];
		that.CONFIG_ELEMENT_DATA = [];
		that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
		that.examService.getExamActivity().subscribe((result: any) => {
			if (result.status === 'ok') {
				that.examActivityArray = result.data;
				if (that.configValue === '5') {
					let pos = 1;
					for (const item of result.data) {
						that.CONFIG_ELEMENT_DATA.push({
							position: pos,
							name: item.ea_name,
							category_name: item.ea_category_id,
							type_name: item.ea_type_id,
							activity_description: item.ea_description,
							action: item
						});
						pos++;
					}
					that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
					that.configDataSource.paginator = that.paginator;
					that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
					that.configDataSource.sort = that.sort;
				}
			} else {
				that.examActivityArray = [];
			}
		});
	}

	getPointType(pt_id) {
		for (let i = 0; i < this.pointTypeArray.length; i++) {
			if (this.pointTypeArray[i]['pt_id'] === pt_id.toString()) {
				return this.pointTypeArray[i]['pt_name'];

			}
		}
	}

	getActivityCategory(rt_id) {
		for (let i = 0; i < this.examActivityCategoryArr.length; i++) {
			if (this.examActivityCategoryArr[i]['eac_id'] === rt_id.toString()) {
				return this.examActivityCategoryArr[i]['eac_name'];

			}
		}
	}

	getActivityType(rt_id) {
		for (let i = 0; i < this.examActivityTypeArr.length; i++) {
			if (this.examActivityTypeArr[i]['eat_id'] === rt_id.toString()) {
				return this.examActivityTypeArr[i]['eat_name'];

			}
		}
	}

	getRemarkTone(rto_id) {
		for (let i = 0; i < this.remarkToneArray.length; i++) {
			if (this.remarkToneArray[i]['remark_tone_id'] === rto_id.toString()) {
				return this.remarkToneArray[i]['remark_tone_name'];

			}
		}
	}

	prepareGradeData(event) {
		const gradeDataTier = event.value;
		this.gradeDataFrmArr = [];

		for (let i = 0; i < 100; i++) {
			this.rangeArray.push({
				'rng_id': (i + 1),
				'rng_value': (i + 1)
			});
		}


		for (let i = 0; i < gradeDataTier; i++) {
			this.gradeDataFrmArr.push({
				formGroup: this.fbuild.group({
					egs_grade_name: '',
					egs_grade_value: '',
					egs_range_start: '',
					egs_range_end: ''
				})
			});
		}

		return this.gradeDataFrmArr;

	}

	setGradeData(gradeDataTier) {
		console.log('gradeDataTier', gradeDataTier);
		this.gradeDataFrmArr = [];

		for (let i = 0; i < 100; i++) {
			this.rangeArray.push({
				'rng_id': (i + 1).toString(),
				'rng_value': (i + 1)
			});
		}


		for (let i = 0; i < gradeDataTier.length; i++) {
			this.gradeDataFrmArr.push({
				formGroup: this.fbuild.group({
					egs_grade_name: gradeDataTier[i]['egs_grade_name'],
					egs_grade_value: gradeDataTier[i]['egs_grade_value'],
					egs_range_start: gradeDataTier[i]['egs_range_start'],
					egs_range_end: gradeDataTier[i]['egs_range_end']
				})
			});
		}

		console.log('this.gradeDataFrmArr', this.gradeDataFrmArr);
		return this.gradeDataFrmArr;
	}

	resetForm(value) {
		this.formGroupArray[value - 1].formGroup.reset();
		this.setupUpdateFlag = false;
	}

	validateForm() {
		let validateFlag = false;
		if (this.showConfigForm === '1') {
			if (this.systemInfoForm.value.class_name === '') {
				this.commonService.showSuccessErrorMessage('Please fill all required field', 'error');
				validateFlag = false;
			} else {
				validateFlag = true;
			}
		}
		return validateFlag;
	}

	getActiveStatus(value: any) {
		if (Number(this.configValue) === 1) { // for exam setup
			if (value.egs_status === '1') {
				return true;
			}
		} else if (Number(this.configValue) === 2) { // for sub exam setup
			if (value.egs_status === '1') {
				return true;
			}
		} else if (Number(this.configValue) === 3) { // for grade setup
			if (value.egs_status === '1') {
				return true;
			}
		} else if (Number(this.configValue) === 4) { // for remark setup
			if (value.ers_status === '1') {
				return true;
			}
		} else if (Number(this.configValue) === 5) { // for exam activity setup
			if (value.ea_status === '1') {
				return true;
			}
		} else if (Number(this.configValue) === 6) { // for report card setup
			if (value.st_status === '1') {
				return true;
			}
		}
	}

	formEdit(value: any) {
		console.log('value', value);
		if (Number(this.configValue) === 1) { // for exam setup
			this.setupUpdateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				class_id: value.class_id,
				class_name: value.class_name,
				class_order: value.class_order,
				class_status: value.class_status
			});
		} else if (Number(this.configValue) === 2) { // for sub exam setup
			this.setupUpdateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				sec_id: value.sec_id,
				sec_name: value.sec_name,
				sec_order: value.sec_order,
				sec_status: value.sec_status
			});
		} else if (Number(this.configValue) === 3) { // for exam grade setup
			this.setupUpdateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				egs_number: value.egs_number,
				egs_name: value.egs_name,
				egs_grade_data: this.setGradeData(value.egs_grade_data),
				egs_point_type: value.egs_point_type,
				egs_no_of_tiers: value.egs_no_of_tiers,
				egs_description: value.egs_description,
				egs_status: value.egs_status
			});

		} else if (Number(this.configValue) === 4) { // for exam remark setup
			this.setupUpdateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				ers_id: value.ers_id,
				ers_name: value.ers_name,
				ers_egs_number: value.ers_egs_number,
				ers_remark_type: value.ers_remark_type,
				ers_remark_description: value.ers_remark_description,
				ers_remark_tone: value.ers_remark_tone,
				ers_status: value.ers_status
			});
		} else if (Number(this.configValue) === 5) { // for exam activity setup
			this.setupUpdateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				ea_id: value.ea_id,
				ea_name: value.ea_name,
				ea_category_id: value.ea_category_id,
				ea_type_id: value.ea_type_id,
				ea_description: value.ea_description,
				ea_status: value.ea_status
			});
		} else if (Number(this.configValue) === 6) { // for report card setup
			this.setupUpdateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				gcss_id: value.gcss_id,
				gcss_entry_id: value.gcss_entry_id,
				gcss_gc_id: value.gcss_gc_id,
				gcss_gs_id: value.gcss_gs_id,
				gcss_gsub_id: value.gcss_gsub_id,
				gcss_status: value.gcss_status
			});
		}
	}

	loadConfiguration(event) {
		this.configFlag = false;
		this.setupUpdateFlag = false;
		this.configValue = event.value;
		if (Number(this.configValue) === 1) { // for exam setup
			this.getExam(this);
			this.displayedColumns = ['position', 'name', 'order', 'action', 'modify'];
			this.configFlag = true;
		} else if (Number(this.configValue) === 2) { // for sub exam setup
			this.getSubExam(this);
			this.displayedColumns = ['position', 'name', 'order', 'action', 'modify'];
			this.configFlag = true;
		} else if (Number(this.configValue) === 3) { // for exam grade setup
			this.getExamGradeSetup(this);
			this.displayedColumns = ['position', 'name', 'point_type_id', 'no_of_tiers', 'grade_name', 'grade_value', 'start_range', 'end_range', 'grade_set_description', 'action', 'modify'];
			this.configFlag = true;
		} else if (Number(this.configValue) === 4) { // for exam remark setup
			this.getExamActivityCategory(this);
			this.getExamRemarkSetup(this);
			this.displayedColumns = ['position', 'name', 'remark_grade_name', 'remark_type', 'remark_tone', 'remark_description', 'action', 'modify'];
			this.configFlag = true;
		} else if (Number(this.configValue) === 5) { // for exam activity setup
			this.getExamActivityCategory(this);
			this.getExamActivityType(this);
			this.getExamActivitySetup(this);
			this.displayedColumns = ['position', 'name', 'category_name', 'type_name', 'activity_description', 'action', 'modify'];
			this.configFlag = true;
		} else if (Number(this.configValue) === 6) { // for exam report card setup
			this.getReportCardSetup(this);
			this.displayedColumns = ['position', 'class_name', 'sec_name', 'sub_name', 'action', 'modify'];
			this.configFlag = true;
		}
	}

	deleteConfirm({ data, type }) {
		switch (type) {
			case '1': // for exam setup
				data.class_status = '5';
				this.deleteEntry(data, 'insertExam', this.getExam);
				break;
			case '2': // for sub exam setup
				data.sec_status = '5';
				this.deleteEntry(data, 'insertSubExam', this.getSubExam);
				break;
			case '3': // for exam grade setup
				data.egs_status = '5';
				this.deleteEntry(data, 'insertExamGradeSetup', this.getExamGradeSetup);
				break;
			case '4': // for exam remark setup
				data.ers_status = '5';
				this.deleteEntry(data, 'insertExamRemarkSetup', this.getExamRemarkSetup);
				break;
			case '5': // for exam activity setup
				data.ea_status = '5';
				this.deleteEntry(data, 'insertExamActivitySetup', this.getExamActivitySetup);
				break;
			case '6': // for exam report card setup
				data.gcss_status = '5';
				this.deleteEntry(data, 'insertReportCardSetup', this.getReportCardSetup);
				break;
		}
	}

	addConfiguration(value) {
		if (!this.formGroupArray[value - 1].formGroup.valid) {
			this.commonService.showSuccessErrorMessage('Enter required fields', 'error');
		} else {
			switch (value) {
				case '1': // for exam setup
					this.formGroupArray[value - 1].formGroup.value.class_status = '1';
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertExam', this.getExam);
					break;
				case '2': // for sub exam setup
					this.formGroupArray[value - 1].formGroup.value.sec_status = '1';
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertSubExam', this.getSubExam);
					break;
				case '3': // for exam grade setup
					this.formGroupArray[value - 1].formGroup.value.sub_status = '1';
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertExamGradeSetup', this.getExamGradeSetup);
					break;
				case '4': // for exam remark setup
					this.formGroupArray[value - 1].formGroup.value.topic_status = '1';
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertExamRemarkSetup', this.getExamRemarkSetup);
					break;
				case '5': // for exam activity setup
					this.formGroupArray[value - 1].formGroup.value.st_status = '1';
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertExamActivitySetup', this.getExamActivitySetup);
					break;
				case '6': // for exam report card setup
					this.formGroupArray[value - 1].formGroup.value.gcss_status = '1';
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertReportCardSetup', this.getReportCardSetup);
					break;
			}
		}
	}

	updateConfiguration(value) {
		if (!this.formGroupArray[value - 1].formGroup.valid) {
			this.commonService.showSuccessErrorMessage('Enter required fields', 'error');
		} else {
			switch (value) {
				case '1': // for exam setup
					this.updateEntry(this.formGroupArray[value - 1].formGroup.value, 'insertExam', this.getExam);
					break;
				case '2': // for sub exam setup
					this.updateEntry(this.formGroupArray[value - 1].formGroup.value, 'insertSubExam', this.getSubExam);
					break;
				case '3': // for exam grade setup
					this.updateEntry(this.formGroupArray[value - 1].formGroup.value, 'insertExamGradeSetup', this.getExamGradeSetup);
					break;
				case '4': // for exam remark setup
					this.updateEntry(this.formGroupArray[value - 1].formGroup.value, 'insertExamRemarkSetup', this.getExamRemarkSetup);
					break;
				case '5': // for exam activity setup
					this.updateEntry(this.formGroupArray[value - 1].formGroup.value, 'insertExamActivitySetup', this.getExamActivitySetup);
					break;
				case '6': // for exam report card setup
					this.updateEntry(this.formGroupArray[value - 1].formGroup.value, 'insertReportCardSetup', this.getReportCardSetup);
					break;
			}
		}
	}

	toggleStatus(value: any) {
		if (Number(this.configValue) === 1) { // for exam setup
			if (value.class_status === '1') {
				value.class_status = '0';
			} else {
				value.class_status = '1';
			}
			this.examService.insertExam(value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getExam(this);
				}
			});
		} else if (Number(this.configValue) === 2) { // for sub exam setup
			if (value.sec_status === '1') {
				value.sec_status = '0';
			} else {
				value.sec_status = '1';
			}
			this.examService.insertSubExam(value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getSubExam(this);
				}
			});
		} else if (Number(this.configValue) === 3) { // for exam grade setup
			if (value.egs_status === '1') {
				value.egs_status = '0';
			} else {
				value.egs_status = '1';
			}
			this.examService.insertExamGradeSetup(value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getExamGradeSetup(this);
				}
			});
		} else if (Number(this.configValue) === 4) { // for exam remark setup
			if (value.ers_status === '1') {
				value.ers_status = '0';
			} else {
				value.ers_status = '1';
			}
			this.examService.insertExamRemarkSetup(value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getExamRemarkSetup(this);
				}
			});
		} else if (Number(this.configValue) === 5) { // for exam activity setup
			if (value.ea_status === '1') {
				value.ea_status = '0';
			} else {
				value.ea_status = '1';
			}
			this.examService.insertExamActivitySetup(value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getExamActivitySetup(this);
				}
			});
		} else if (Number(this.configValue) === 6) { // for exam report card setup
			if (value.gcss_status === '1') {
				value.gcss_status = '0';
			} else {
				value.gcss_status = '1';
			}
			this.examService.insertReportCardSetup(value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getReportCardSetup(this);
				}
			});
		}
	}

	applyFilter(event) {
		this.configDataSource.filter = event.trim().toLowerCase();
	}

	deleteCancel() { }

	deleteEntry(deletedData, serviceName, next) {
		this.smartService[serviceName](deletedData).subscribe((result: any) => {
			if (result.status === 'ok') {
				next(this);
				this.commonService.showSuccessErrorMessage('Deleted Succesfully', 'success');
			}
		});
	}
	addEntry(data, serviceName, next) {
		this.smartService[serviceName](data).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.resetForm(this.configValue);
				next(this);
				this.commonService.showSuccessErrorMessage('Added Succesfully', 'success');
			} else {
				this.commonService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	updateEntry(data, serviceName, next) {
		this.smartService[serviceName](data).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.resetForm(this.configValue);
				this.setupUpdateFlag = false;
				next(this);
				this.commonService.showSuccessErrorMessage('Updated Succesfully', 'success');
			} else {
				this.commonService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}

}