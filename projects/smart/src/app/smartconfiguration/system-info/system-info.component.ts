import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService } from '../../_services';
import { MatTableDataSource, MatPaginator, MatSort, ErrorStateMatcher } from '@angular/material';
import { ConfigElement } from './system-info.model';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
@Component({
	selector: 'app-system-info',
	templateUrl: './system-info.component.html',
	styleUrls: ['./system-info.component.css']
})
export class SystemInfoComponent implements OnInit, AfterViewInit {
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
	CONFIG_ELEMENT_DATA: ConfigElement[] = [];
	configDataSource = new MatTableDataSource<ConfigElement>(this.CONFIG_ELEMENT_DATA);
	displayedColumns: any[] = ['position', 'name', 'order', 'action', 'modify'];
	firstHeaderArray: any[] = ['Class Name', 'Section Name', 'Subject Name', 'Topic Name', 'SubTopic Name', 'Class Name', 'Class Name'];
	secondHeaderArray: any[] = ['Order', 'Order', 'Order', 'Order', 'Order', 'Order'];
	configFlag = false;


	constructor(
		private fbuild: FormBuilder,
		private smartService: SmartService,
		public commonService: CommonAPIService,
		public axiomService: AxiomService,
		public sisService: SisService,
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

		this.formGroupArray = [{
			formGroup: this.fbuild.group({
				class_id: '',
				class_name: '',
				class_order: '',
				class_status: ''
			})
		},
		{
			formGroup: this.fbuild.group({
				sec_id: '',
				sec_name: '',
				sec_order: '',
				sec_status: ''
			})
		},
		{
			formGroup: this.fbuild.group({
				sub_id: '',
				sub_parent_id: '',
				sub_name: '',
				sub_order: '',
				sub_status: ''
			})
		},
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
		{
			formGroup: this.fbuild.group({
				st_id: '',
				st_name: '',
				st_topic_id: '',
				st_order: '',
				st_status: ''
			})
		},
		{
			formGroup: this.fbuild.group({
				gcss_id: '',
				gcss_gc_id: '',
				gcss_gs_id: '',
				gcss_gsub_id: '',
				gcss_status: ''
			})
		}, {
			formGroup: this.fbuild.group({
				class_id: '',
				no_of_day: '',
				no_of_period: ''
			})
		}];
	}
	// delete dialog open modal function
	deleteSetupList(j) {
		this.param.indexj = j;
		this.param.text = 'Delete';
		this.deleteModal.openModal(this.param);
	}
	// get class list
	getClass(that) {
		const classParam: any = {};
		// classParam.role_id = this.currentUser.role_id;
		// classParam.login_id = this.currentUser.login_id;
		// that.smartService.getClass(classParam)
		// 	.subscribe(
		// 		(result: any) => {
		// 			if (result && result.status === 'ok') {
		// 				this.classArray = result.data;
		// 				this.finaldivflag = false;
		// 			} else {
		// 				this.classArray = [];
		// 			}
		// 		}
		// 	);

		that.classArray = [];
		that.smartService.getClass().subscribe((result: any) => {
			if (result.status === 'ok') {
				that.classArray = result.data;
				if (that.configValue === '1') {
					that.CONFIG_ELEMENT_DATA = [];
					that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
					let pos = 1;
					for (const item of result.data) {
						that.CONFIG_ELEMENT_DATA.push({
							position: pos,
							name: item.class_name,
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
				that.classArray = [];
			}
		});
	}

	getSection(that) {
		that.secArray = [];
		that.smartService.getSection().subscribe((result: any) => {
			if (result.status === 'ok') {
				that.secArray = result.data;
				if (that.configValue === '2') {
					that.CONFIG_ELEMENT_DATA = [];
					that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
					let pos = 1;
					for (const item of result.data) {
						that.CONFIG_ELEMENT_DATA.push({
							position: pos,
							name: item.sec_name,
							order: item.sec_order,
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
				that.secArray = [];
			}
		});
	}

	getSubject(that) {
		that.subArray = [];
		that.parentSubArray = [];
		that.smartService.getSubject().subscribe((result: any) => {
			if (result.status === 'ok') {
				that.subArray = result.data;

				for (const pi of result.data) {
					if (pi.sub_parent_id === '0') {
						that.parentSubArray.push(pi);
					}
				}

				console.log('that.parentSubArray', that.parentSubArray);

				if (that.configValue === '3') {
					that.CONFIG_ELEMENT_DATA = [];
					that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
					let pos = 1;
					for (const item of result.data) {
						that.CONFIG_ELEMENT_DATA.push({
							position: pos,
							name: item.sub_name,
							order: item.sub_order,
							sub_parent_id: that.getParentSubjectName(item.sub_parent_id),
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
				that.subArray = [];
			}
		});
	}

	getParentSubjectName(parentId) {
		for (const item of this.parentSubArray ) {
			if (item.sub_id === parentId) {
				return item.sub_name;
			}
		}
	}

	getTopic(that) {
		that.topicArray = [];
		that.getClass(that);
		that.getSubject(that);
		that.smartService.getTopic().subscribe((result: any) => {
			if (result.status === 'ok') {
				that.topicArray = result.data;
				console.log('this.topicArray', that.topicArray);
				console.log('this.configValue', that.configValue);
				if (that.configValue === '4') {
					that.CONFIG_ELEMENT_DATA = [];
					that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
					let pos = 1;
					for (const item of result.data) {
						that.CONFIG_ELEMENT_DATA.push({
							position: pos,
							name: item.topic_name,
							class_name: item.class_name,
							sub_name: item.sub_name,
							order: item.topic_order,
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
				that.topicArray = [];
			}
		});
	}

	getSubTopic(that) {
		that.getTopic(that);
		that.smartService.getSubTopic().subscribe((result: any) => {
			if (result.status === 'ok') {
				if (that.configValue === '5') {
					that.CONFIG_ELEMENT_DATA = [];
					that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
					let pos = 1;
					for (const item of result.data) {
						that.CONFIG_ELEMENT_DATA.push({
							position: pos,
							name: item.st_name,
							topic_name: item.topic_name,
							order: item.st_order,
							action: item
						});
						pos++;
					}
					that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
					that.configDataSource.paginator = that.paginator;
					that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
					that.configDataSource.sort = that.sort;
				}

			}
		});
	}

	getClassSectionSubject(that) {
		that.getClass(that);
		that.getSection(that);
		that.getSubject(that);

		that.smartService.getGlobalClassSectionSubject().subscribe((result: any) => {
			if (result.status === 'ok') {
				if (that.configValue === '6') {
					that.CONFIG_ELEMENT_DATA = [];
					that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
					let pos = 1;
					for (const item of result.data) {
						that.CONFIG_ELEMENT_DATA.push({
							position: pos,
							name: item.class_name,
							sec_name: item.sec_name,
							sub_name: item.sub_name,
							order: item.gcss_order,
							action: item
						});
						pos++;
					}
					that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
					that.configDataSource.paginator = that.paginator;
					that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
					that.configDataSource.sort = that.sort;
				}

			}
		});
	}

	//  Get Class Name from existion Array for details table
	getSetupClass(class_id) {
		const cindex = this.classArray.findIndex(f => Number(f.class_id) === Number(class_id));
		if (cindex !== -1) {
			return this.classArray[cindex].class_name;
		}
	}

	// Edit setup list function
	editSetupList(value) {
		this.setupUpdateFlag = true;
		this.editFlag = true;
		this.systemInfoForm.patchValue({
			'class_id': this.detailArray[value].class_id.toString(),
			'no_of_day': this.detailArray[value].no_of_day.toString(),
			'no_of_period': this.detailArray[value].no_of_period.toString(),
		});
	}
	deleteClassEntry($event) {
		if ($event) {
			const param: any = {};
			param.class_id = this.detailArray[this.param.indexj].class_id;
			this.smartService.deleteClassEntry(param)
				.subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.commonService.showSuccessErrorMessage('Setup Deleted Successfully', 'success');
							this.resetForm(this.configValue);
							this.getDetailsCdpRelation(this);
						}
					});
		}
	}

	// update setup list function
	// updateConfiguration() {
	// 	this.editFlag = false;
	// 	this.setupUpdateFlag = false;
	// 	if (this.systemInfoForm.valid) {
	// 		this.smartService.updateClasswisePeriod(this.systemInfoForm.value).subscribe((result: any) => {
	// 			if (result && result.status === 'ok') {
	// 				this.commonService.showSuccessErrorMessage('Classwise setup updated successfully', 'success');
	// 				this.resetForm(this.configValue);
	// 				this.getDetailsCdpRelation(this);
	// 			}
	// 		});
	// 	} else {
	// 		this.commonService.showSuccessErrorMessage('Please fill all required field', 'error');
	// 	}
	// }

	// Reset setup  form
	// resetForm() {
	// 	this.systemInfoForm.patchValue({
	// 		'class_id': '',
	// 		'no_of_day': '',
	// 		'no_of_period': '',
	// 	});
	// 	this.editFlag = false;
	// 	this.setupUpdateFlag = false;

	// }

	resetForm(value) {
		this.formGroupArray[value - 1].formGroup.reset();
		this.setupUpdateFlag = false;
	}

	// add class wise day and period
	// addConfiguration(configValue) {
	// 	let validateFlag = false;
	// 	if (this.configValue === '') {
	// 		this.commonService.showSuccessErrorMessage('Please Choose Setup Option', 'error');
	// 	} else if (this.configValue === '1') {
	// 		validateFlag = this.validateForm();
	// 		if (validateFlag) {
	// 			const inputJson = {
	// 				class_name: this.systemInfoForm.value.class_name
	// 			};
	// 			this.smartService.insertClass(inputJson).subscribe((result: any) => {
	// 				if (result && result.status === 'ok') {
	// 					this.commonService.showSuccessErrorMessage(result.message, 'success');
	// 				} else {
	// 					this.commonService.showSuccessErrorMessage(result.message, 'error');
	// 				}
	// 				this.systemInfoForm.reset();
	// 			});
	// 		}
	// 	}

	// 	// if (this.systemInfoForm.valid) {
	// 	// 	const classArray: any = {};
	// 	// 	classArray.class_id = this.systemInfoForm.value.class_id;
	// 	// 	this.smartService.checkClassEntry(classArray).subscribe((result: any) => {
	// 	// 		if (result && result.status === 'ok') {
	// 	// 			this.commonService.showSuccessErrorMessage('Classwise setup Already added', 'error');
	// 	// 		} else {
	// 	// 			this.smartService.insertClasswisePeriod(this.systemInfoForm.value).subscribe((result: any) => {
	// 	// 				if (result && result.status === 'ok') {
	// 	// 					this.commonService.showSuccessErrorMessage('Classwise setup insert successfully', 'success');
	// 	// 					this.resetForm();
	// 	// 					this.getDetailsCdpRelation();
	// 	// 				}
	// 	// 			});
	// 	// 		}
	// 	// 	});
	// 	// } else {
	// 	// 	this.commonService.showSuccessErrorMessage('Please fill all required field', 'error');
	// 	// }
	// }


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

	// get class wise day and period details
	getDetailsCdpRelation(that) {
		that.detailArray = [];
		that.getClass(that);
		that.smartService.getDetailsCdpRelation()
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						that.detailArray = result.data;

						if (that.configValue === '7') {
							that.CONFIG_ELEMENT_DATA = [];
							that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
							let pos = 1;
							for (const item of result.data) {
								that.CONFIG_ELEMENT_DATA.push({
									position: pos,
									name: item.class_id,
									no_of_day: item.no_of_day,
									no_of_period: item.no_of_period,
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
						that.detailArray = [];
					}
				}
			);
	}

	getActiveStatus(value: any) {
		if (Number(this.configValue) === 1) {
			if (value.class_status === '1') {
				return true;
			}
		} else if (Number(this.configValue) === 2) {
			if (value.sec_status === '1') {
				return true;
			}
		} else if (Number(this.configValue) === 3) {
			if (value.sub_status === '1') {
				return true;
			}
		} else if (Number(this.configValue) === 4) {
			if (value.topic_status === '1') {
				return true;
			}
		} else if (Number(this.configValue) === 5) {
			if (value.st_status === '1') {
				return true;
			}
		} else if (Number(this.configValue) === 6) {
			if (value.gcss_status === '1') {
				return true;
			}
		} else if (Number(this.configValue) === 7) {
			if (value.cdp_status === '1') {
				return true;
			}
		}
	}

	formEdit(value: any) {
		if (Number(this.configValue) === 1) {
			this.setupUpdateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				class_id: value.class_id,
				class_name: value.class_name,
				class_order: value.class_order,
				class_status: value.class_status
			});
		} else if (Number(this.configValue) === 2) {
			this.setupUpdateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				sec_id: value.sec_id,
				sec_name: value.sec_name,
				sec_order: value.sec_order,
				sec_status: value.sec_status
			});
		} else if (Number(this.configValue) === 3) {
			this.setupUpdateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				sub_id: value.sub_id,
				sub_name: value.sub_name,
				sub_parent_id: value.sub_parent_id,
				sub_order: value.sub_order,
				sub_status: value.sub_status
			});
		} else if (Number(this.configValue) === 4) {
			this.setupUpdateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				topic_id: value.topic_id,
				topic_class_id: value.topic_class_id,
				topic_sub_id: value.topic_sub_id,
				topic_name: value.topic_name,
				topic_order: value.topic_order,
				topic_status: value.topic_status
			});
		} else if (Number(this.configValue) === 5) {
			this.setupUpdateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				st_id: value.st_id,
				st_name: value.st_name,
				st_topic_id: value.st_topic_id,
				st_order: value.st_order,
				st_status: value.st_status
			});
		} else if (Number(this.configValue) === 6) {
			this.setupUpdateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				gcss_id: value.gcss_id,
				gcss_gc_id: value.gcss_gc_id,
				gcss_gs_id: value.gcss_gs_id,
				gcss_gsub_id: value.gcss_gsub_id,
				gcss_status: value.gcss_status
			});
		} else if (Number(this.configValue) === 7) {
			this.setupUpdateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				class_id: value.class_id,
				no_of_day: value.no_of_day,
				no_of_period: value.no_of_period
			});
		}
	}

	loadConfiguration(event) {
		this.configFlag = false;
		this.setupUpdateFlag = false;
		this.configValue = event.value;
		if (Number(this.configValue) === 1) {
			this.getClass(this);
			this.displayedColumns = ['position', 'name', 'order', 'action', 'modify'];
			this.configFlag = true;
		} else if (Number(this.configValue) === 2) {
			this.getSection(this);
			this.displayedColumns = ['position', 'name', 'order', 'action', 'modify'];
			this.configFlag = true;
		} else if (Number(this.configValue) === 3) {
			this.getSubject(this);
			this.displayedColumns = ['position', 'name', 'sub_parent_id' , 'order', 'action', 'modify'];
			this.configFlag = true;
		} else if (Number(this.configValue) === 4) {
			this.getTopic(this);
			this.displayedColumns = ['position', 'name', 'class_name', 'sub_name', 'order', 'action', 'modify'];
			this.configFlag = true;
		} else if (Number(this.configValue) === 5) {
			this.getSubTopic(this);
			this.displayedColumns = ['position', 'name', 'topic_name', 'order', 'action', 'modify'];
			this.configFlag = true;
		} else if (Number(this.configValue) === 6) {
			this.getClassSectionSubject(this);
			this.displayedColumns = ['position', 'name', 'sec_name', 'sub_name', 'order', 'action', 'modify'];
			this.configFlag = true;
		} else if (Number(this.configValue) === 7) {
			this.getDetailsCdpRelation(this);
			this.displayedColumns = ['position', 'name', 'no_of_day', 'no_of_period', 'action', 'modify'];
			this.configFlag = true;
		}
	}

	deleteConfirm({ data, type }) {
		switch (type) {
			case '1':
				data.class_status = '5';
				this.deleteEntry(data, 'insertClass', this.getClass);
				break;
			case '2':
				data.sec_status = '5';
				this.deleteEntry(data, 'insertSection', this.getSection);
				break;
			case '3':
				data.sub_status = '5';
				this.deleteEntry(data, 'insertSubject', this.getSubject);
				break;
			case '4':
				data.topic_status = '5';
				this.deleteEntry(data, 'insertTopic', this.getTopic);
				break;
			case '5':
				data.st_status = '5';
				this.deleteEntry(data, 'insertSubTopic', this.getSubTopic);
				break;
			case '6':
				data.gcss_status = '5';
				this.deleteEntry(data, 'insertGlobalClassSectionSubject', this.getClassSectionSubject);
				break;
			case '7':
				this.deleteEntry(data, 'deleteClassEntry', this.getDetailsCdpRelation);
				break;
		}
	}

	addConfiguration(value) {
		if (!this.formGroupArray[value - 1].formGroup.valid) {
			this.commonService.showSuccessErrorMessage('Enter required fields', 'error');
		} else {
			switch (value) {
				case '1':
					this.formGroupArray[value - 1].formGroup.value.class_status = '1';
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertClass', this.getClass);
					break;
				case '2':
					this.formGroupArray[value - 1].formGroup.value.sec_status = '1';
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertSection', this.getSection);
					break;
				case '3':
					this.formGroupArray[value - 1].formGroup.value.sub_status = '1';
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertSubject', this.getSubject);
					break;
				case '4':
					this.formGroupArray[value - 1].formGroup.value.topic_status = '1';
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertTopic', this.getTopic);
					break;
				case '5':
					this.formGroupArray[value - 1].formGroup.value.st_status = '1';
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertSubtopic', this.getSubTopic);
					break;
				case '6':
					this.formGroupArray[value - 1].formGroup.value.mt_status = '1';
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertGlobalClassSectionSubject', this.getClassSectionSubject);
					break;
				case '7':
					this.formGroupArray[value - 1].formGroup.value.cdp_status = '1';
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertClasswisePeriod', this.getDetailsCdpRelation);
					break;
			}
		}
	}

	updateConfiguration(value) {
		if (!this.formGroupArray[value - 1].formGroup.valid) {
			this.commonService.showSuccessErrorMessage('Enter required fields', 'error');
		} else {
			switch (value) {
				case '1':
					this.updateEntry(this.formGroupArray[value - 1].formGroup.value, 'insertClass', this.getClass);
					break;
				case '2':
					this.updateEntry(this.formGroupArray[value - 1].formGroup.value, 'insertSection', this.getSection);
					break;
				case '3':
					this.updateEntry(this.formGroupArray[value - 1].formGroup.value, 'insertSubject', this.getSubject);
					break;
				case '4':
					this.updateEntry(this.formGroupArray[value - 1].formGroup.value, 'insertTopic', this.getTopic);
					break;
				case '5':
					this.updateEntry(this.formGroupArray[value - 1].formGroup.value, 'insertSubTopic', this.getSubTopic);
					break;
				case '6':
					this.updateEntry(this.formGroupArray[value - 1].formGroup.value, 'insertGlobalClassSectionSubject', this.getClassSectionSubject);
					break;
				case '7':
					this.updateEntry(this.formGroupArray[value - 1].formGroup.value, 'updateClasswisePeriod', this.getDetailsCdpRelation);
					break;
			}
		}
	}

	toggleStatus(value: any) {
		if (Number(this.configValue) === 1) {
			if (value.class_status === '1') {
				value.class_status = '0';
			} else {
				value.class_status = '1';
			}
			this.smartService.insertClass(value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getClass(this);
				}
			});
		} else if (Number(this.configValue) === 2) {
			if (value.sec_status === '1') {
				value.sec_status = '0';
			} else {
				value.sec_status = '1';
			}
			this.smartService.insertSection(value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getSection(this);
				}
			});
		} else if (Number(this.configValue) === 3) {
			if (value.sub_status === '1') {
				value.sub_status = '0';
			} else {
				value.sub_status = '1';
			}
			this.smartService.insertSubject(value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getSubject(this);
				}
			});
		} else if (Number(this.configValue) === 4) {
			if (value.topic_status === '1') {
				value.topic_status = '0';
			} else {
				value.topic_status = '1';
			}
			this.smartService.insertTopic(value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getTopic(this);
				}
			});
		} else if (Number(this.configValue) === 5) {
			if (value.st_status === '1') {
				value.st_status = '0';
			} else {
				value.st_status = '1';
			}
			this.smartService.insertSubTopic(value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getSubTopic(this);
				}
			});
		} else if (Number(this.configValue) === 6) {
			if (value.gcss_status === '1') {
				value.gcss_status = '0';
			} else {
				value.gcss_status = '1';
			}
			this.smartService.insertGlobalClassSectionSubject(value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getClassSectionSubject(this);
				}
			});
		} else if (Number(this.configValue) === 7) {
			if (value.cdp_status === '1') {
				value.cdp_status = '0';
			} else {
				value.cdp_status = '1';
			}
			this.smartService.updateClasswisePeriod(value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getDetailsCdpRelation(this);
				}
			});
		}
	}

	applyFilter(event) { }

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
			}
		});
	}
}
