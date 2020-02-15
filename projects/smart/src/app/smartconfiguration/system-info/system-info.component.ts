import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService } from '../../_services';
import { MatTableDataSource, MatPaginator, MatSort, ErrorStateMatcher } from '@angular/material';
import { ConfigElement } from './system-info.model';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
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
	classArray: any[] = [];
	parentSubArray: any[];
	secArray: any[] = [];
	topicArray: any[] = [];
	detailArray: any[] = [];
	systemInfoForm: FormGroup;
	setupUpdateFlag = false;
	editFlag = false;
	finaldivflag = true;
	showConfigForm = '';
	subArray: any[] = [];
	file: any;
	finalXlsTopicArray: any[] = [];
	XlslArray: any[] = [];
	arrayBuffer: any;
	subjectTypeArr: any[] = [];
	CONFIG_ELEMENT_DATA: ConfigElement[] = [];
	configDataSource = new MatTableDataSource<ConfigElement>(this.CONFIG_ELEMENT_DATA);
	displayedColumns: any[] = ['position', 'name', 'order', 'action', 'modify'];
	firstHeaderArray: any[] = ['Class Name', 'Section Name', 'Subject Name', 'Topic Name', 'SubTopic Name', 'Class Name', 'Class Name'];
	secondHeaderArray: any[] = ['Order', 'Order', 'Order', 'Order', 'Order', 'Order'];
	configFlag = false;
	paramform: FormGroup;
	searchtoggle = false;
	psubArray: any[] = [];
	ptopicArray: any[] = [];
	stopicArray: any[] = [];
	disabledApiButton = false;
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
	advanceSearchToggle() {
		this.searchtoggle = true;
	}
	getSubjectsByClass() {
		this.psubArray = [];
		this.smartService.getSubjectsByClass({ class_id: this.paramform.value.param_class_id }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.psubArray = result.data;
			}
		})
	}
	getSubjectsByClassForTopic() {
		const topicformgroup: FormGroup = this.formGroupArray[this.configValue - 1].formGroup;
		const param: any = {};
		if (topicformgroup.value.topic_class_id) {
			param.class_id = topicformgroup.value.topic_class_id;
		}
		this.subArray = [];
		this.smartService.getSubjectsByClass(param).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.subArray = result.data;
			}
		})
	}
	searchTopic() {
		if (this.paramform.value.param_topic_id) {
			this.getSubTopic(this);
		} else {
			this.getTopic(this);
		}

	}
	resetTopic() {
		this.paramform.reset();
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
		this.paramform = this.fbuild.group({
			param_class_id: '',
			param_sub_id: '',
			param_topic_id: ''
		})
		this.formGroupArray = [{
			formGroup: this.fbuild.group({
				class_id: '',
				class_name: '',
				class_order: '',
				class_status: '',
				is_board: ''
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
				sub_code: '',
				sub_name: '',
				sub_order: '',
				sub_status: '',
				sub_timetable: '',
				sub_isexam: '',
				sub_type_id: '',
				sub_category: '',
				sub_color: '#000000'
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
				topic_class_id: '',
				topic_sub_id: '',
				st_topic_id: '',
				st_order: '',
				st_status: ''
			})
		},
		{
			formGroup: this.fbuild.group({
				gcss_id: '',
				gcss_entry_id: '',
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
	getClassIsBoard($event, configVal) {
		if ($event.checked) {
			this.formGroupArray[configVal - 1].formGroup.value.is_board = true;
		} else {
			this.formGroupArray[configVal - 1].formGroup.value.is_board = false;
		}
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
		that.CONFIG_ELEMENT_DATA = [];
		that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
		that.smartService.getClass().subscribe((result: any) => {
			if (result.status === 'ok') {
				that.classArray = result.data;
				if (that.configValue === '1') {
					let pos = 1;
					for (const item of result.data) {
						that.CONFIG_ELEMENT_DATA.push({
							position: item.class_id,
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
	getActiveClass(that) {
		this.classArray = [];
		this.smartService.getClass({ class_status: '1' }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.classArray = result.data;
			}
		});
	}
	getSection(that) {
		that.secArray = [];
		that.CONFIG_ELEMENT_DATA = [];
		that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
		that.smartService.getSection().subscribe((result: any) => {
			if (result.status === 'ok') {
				that.secArray = result.data;
				if (that.configValue === '2') {
					let pos = 1;
					for (const item of result.data) {
						that.CONFIG_ELEMENT_DATA.push({
							position: item.sec_id,
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
		that.CONFIG_ELEMENT_DATA = [];
		that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
		that.smartService.getSubject().subscribe((result: any) => {
			if (result.status === 'ok') {
				that.subArray = result.data;

				for (const pi of result.data) {
					if (pi.sub_parent_id === '0') {
						that.parentSubArray.push(pi);
					}
				}

				if (that.configValue === '3') {
					let pos = 1;
					for (const item of result.data) {
						that.CONFIG_ELEMENT_DATA.push({
							position: item.sub_id,
							name: item.sub_name,
							sub_code: item.sub_code,
							sub_timetable: item.sub_timetable === '1' ? true : false,
							sub_isexam: item.sub_isexam === '1' ? true : false,
							sub_color: item.sub_color,
							sub_type: item.sub_type,
							sub_type_name: that.getSubjectTypeName(item.sub_type),
							sub_category: item.sub_category,
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

	getSubjectTypeName(typeId) {
		for (const item of this.subjectTypeArr) {
			if (item.eac_id === typeId) {
				return item.eac_name;
			}
		}
	}

	getSubjectType(that) {
		that.smartService.getSubjectType().subscribe((result: any) => {
			if (result.status === 'ok') {
				that.subjectTypeArr = result.data;
			} else {
				that.subjectTypeArr = [];
			}
		});
	}


	getParentSubjectName(parentId) {
		for (const item of this.parentSubArray) {
			if (item.sub_id === parentId) {
				return item.sub_name;
			}
		}
	}

	getTopicForParam() {
		this.ptopicArray = [];
		const param: any = {};
		if (this.paramform.value.param_class_id) {
			param.topic_class_id = this.paramform.value.param_class_id;
		}
		if (this.paramform.value.param_sub_id) {
			param.topic_sub_id = this.paramform.value.param_sub_id;
		}
		this.smartService.getTopic(param).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.ptopicArray = result.data;
			}
		});
	}
	getTopicForSubtopic() {
		this.stopicArray = [];
		const param: any = {};
		const topicformgroup: FormGroup = this.formGroupArray[this.configValue - 1].formGroup;
		if (topicformgroup.value.topic_class_id) {
			param.topic_class_id = topicformgroup.value.topic_class_id;
		}
		if (topicformgroup.value.topic_sub_id) {
			param.topic_sub_id = topicformgroup.value.topic_sub_id;
		}
		this.smartService.getTopic(param).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.stopicArray = result.data;
			}
		});
	}

	getTopic(that) {
		that.topicArray = [];
		that.ptopicArray = [];
		that.getClass(that);
		that.CONFIG_ELEMENT_DATA = [];
		that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
		const param: any = {};
		if (that.paramform.value.param_class_id) {
			param.topic_class_id = that.paramform.value.param_class_id;
		}
		if (that.paramform.value.param_sub_id) {
			param.topic_sub_id = that.paramform.value.param_sub_id;
		}
		that.smartService.getTopic(param).subscribe((result: any) => {
			if (result.status === 'ok') {
				if (that.paramform.value.param_sub_id) {
					that.ptopicArray = result.data;
				} else {
					that.topicArray = result.data;
				}
				if (that.configValue === '4') {
					let pos = 1;
					for (const item of result.data) {
						that.CONFIG_ELEMENT_DATA.push({
							position: item.topic_id,
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
		//that.getTopic(that);
		that.getClass(that);
		that.CONFIG_ELEMENT_DATA = [];
		that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
		const param: any = {};
		if (that.paramform.value.param_class_id) {
			param.class_id = that.paramform.value.param_class_id;
		}
		if (that.paramform.value.param_sub_id) {
			param.sub_id = that.paramform.value.param_sub_id;
		}
		if (that.paramform.value.param_topic_id) {
			param.st_topic_id = that.paramform.value.param_topic_id;
		}
		that.smartService.getSubTopic(param).subscribe((result: any) => {
			if (result.status === 'ok') {
				if (that.configValue === '5') {
					let pos = 1;
					for (const item of result.data) {
						that.CONFIG_ELEMENT_DATA.push({
							position: item.st_id,
							name: item.st_name,
							class_name: item.class_name,
							sub_name: item.sub_name,
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
		that.classArray = [];
		that.secArray = [];
		that.subArray = [];
		that.smartService.getClass({ class_status: '1' }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				that.classArray = result.data;
				that.smartService.getSection().subscribe((result: any) => {
					if (result.status === 'ok') {
						that.secArray = result.data;
						that.smartService.getSubject().subscribe((result: any) => {
							if (result.status === 'ok') {
								that.subArray = result.data;
								that.CONFIG_ELEMENT_DATA = [];
								that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
								that.smartService.getGlobalClassSectionSubject().subscribe((result: any) => {
									if (result.status === 'ok') {
										if (that.configValue === '6') {
											let pos = 1;
											for (const item of result.data) {
												const class_arr = [];
												const sec_arr = [];
												const sub_arr = [];
												for (let ci = 0; ci < item.gcss_gc_id.length; ci++) {
													const class_name = that.getClassName(item.gcss_gc_id[ci]);
													class_arr.push(class_name);
												}
												for (let ci = 0; ci < item.gcss_gs_id.length; ci++) {
													const sec_name = that.getSecName(item.gcss_gs_id[ci]);
													sec_arr.push(sec_name);
												}
												for (let ci = 0; ci < item.gcss_gsub_id.length; ci++) {
													const sub_name = that.getSubName(item.gcss_gsub_id[ci]);
													sub_arr.push(sub_name);
												}
												that.CONFIG_ELEMENT_DATA.push({
													position: pos,
													class_name: class_arr.toString(),
													sec_name: sec_arr.toString(),
													sub_name: sub_arr.toString(),
													entry_id: item.gcss_entry_id,
													gcss_id: item.gcss_id,
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
						});
					}
				});



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
		that.CONFIG_ELEMENT_DATA = [];
		that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
		that.detailArray = [];
		that.getActiveClass(that);
		that.smartService.getDetailsCdpRelation()
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						that.detailArray = result.data;

						if (that.configValue === '7') {
							let pos = 1;
							for (const item of result.data) {
								that.CONFIG_ELEMENT_DATA.push({
									position: pos,
									name: that.getClassName(item.class_id),
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

	getClassName(classId) {
		for (const item of this.classArray) {
			if (Number(item.class_id) === Number(classId)) {
				return item.class_name;
			}
		}
	}

	getSecName(secId) {
		for (const item of this.secArray) {
			if (Number(item.sec_id) === Number(secId)) {
				return item.sec_name;
			}
		}
	}

	getSubName(subId) {
		for (const item of this.subArray) {
			if (Number(item.sub_id) === Number(subId)) {
				return item.sub_name;
			}
		}
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
				class_status: value.class_status,
				is_board: value.is_board === '1' ? true : false
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
				sub_status: value.sub_status,
				sub_code: value.sub_code,
				sub_timetable: value.sub_timetable === '1' ? true : false,
				sub_isexam: value.sub_isexam === '1' ? true : false,
				sub_type_id: value.sub_type,
				sub_category: value.sub_category,
				sub_color: value.sub_color
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
			console.log(value);
			this.setupUpdateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				st_id: value.st_id,
				st_name: value.st_name,
				topic_class_id: value.class_id,
				topic_sub_id: value.sub_id,
				st_topic_id: value.st_topic_id,
				st_order: value.st_order,
				st_status: value.st_status
			});
			this.getSubjectsByClassForTopic();
		} else if (Number(this.configValue) === 6) {
			this.setupUpdateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				gcss_id: value.gcss_id,
				gcss_entry_id: value.gcss_entry_id,
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
		this.searchtoggle = false;
		this.paramform.reset();
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
			this.getSubjectType(this);
			this.getSubject(this);
			this.displayedColumns = ['position', 'name', 'sub_parent_id', 'sub_code', 'sub_timetable', 'sub_isexam', 'sub_type_name', 'sub_category', 'sub_color', 'order', 'action', 'modify'];
			this.configFlag = true;
		} else if (Number(this.configValue) === 4) {
			this.getTopic(this);
			this.displayedColumns = ['position', 'name', 'class_name', 'sub_name', 'order', 'action', 'modify'];
			this.configFlag = true;
		} else if (Number(this.configValue) === 5) {
			this.getSubTopic(this);
			this.displayedColumns = ['position', 'name', 'class_name', 'sub_name', 'topic_name', 'order', 'action', 'modify'];
			this.configFlag = true;
		} else if (Number(this.configValue) === 6) {
			this.getClassSectionSubject(this);
			this.displayedColumns = ['position', 'class_name', 'sec_name', 'sub_name', 'action', 'modify'];
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
			this.disabledApiButton = true;
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
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertSubTopic', this.getSubTopic);
					break;
				case '6':
					this.formGroupArray[value - 1].formGroup.value.gcss_status = '1';
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
			this.disabledApiButton = true;
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
				this.disabledApiButton = false;
				if (this.configValue === '4') {
					this.formGroupArray[this.configValue - 1].formGroup.patchValue({
						topic_name: this.configValue.topic_name
					});
				} else if (this.configValue === '5') {
					this.formGroupArray[this.configValue - 1].formGroup.patchValue({
						st_name: this.configValue.st_name
					});
				} else {
					this.resetForm(this.configValue);
				}
				next(this);
				this.commonService.showSuccessErrorMessage('Added Succesfully', 'success');
			} else {
				this.disabledApiButton = false;
				this.commonService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	updateEntry(data, serviceName, next) {
		this.smartService[serviceName](data).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.disabledApiButton = false;
				if (this.configValue === '4') {
					this.formGroupArray[this.configValue - 1].formGroup.patchValue({
						topic_name: this.configValue.topic_name
					});
				} else if (this.configValue === '5') {
					this.formGroupArray[this.configValue - 1].formGroup.patchValue({
						st_name: this.configValue.st_name
					});
				} else {
					this.resetForm(this.configValue);
				}
				this.setupUpdateFlag = false;
				next(this);
				this.commonService.showSuccessErrorMessage('Updated Succesfully', 'success');
			} else {
				this.disabledApiButton = false;
				this.commonService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}

	incomingFile(event) {
		this.file = '';
		this.file = event.target.files[0];
		this.UploadTopic();
	}

	incomingSubTopicFile(event) {
		this.file = '';
		this.file = event.target.files[0];
		this.UploadSubTopic();
	}

	topicExcelDownload() {
		const value = this.configValue;
		if (value === '4') {
			if (!this.formGroupArray[value - 1].formGroup.value.topic_class_id) {
				this.commonService.showSuccessErrorMessage('Please Choose Class to Download Sample Topic Excel', 'error');
			} else if (!this.formGroupArray[value - 1].formGroup.value.topic_sub_id) {
				this.commonService.showSuccessErrorMessage('Please Choose Subject to Download Sample Topic Excel', 'error');
			} else {

				const inputJson = {
					class_id: this.formGroupArray[value - 1].formGroup.value.topic_class_id,
					sub_id: this.formGroupArray[value - 1].formGroup.value.topic_sub_id
				};
				this.smartService.downloadTopicExcel(inputJson)
					.subscribe(
						(excel_r: any) => {
							if (excel_r && excel_r.status === 'ok') {
								const length = excel_r.data.split('/').length;
								saveAs(excel_r.data, excel_r.data.split('/')[length - 1]);
								this.resetForm(this.configValue);
							}
						});
			}
		}
	}

	subTopicExcelDownload() {
		const value = this.configValue;
		if (value === '5') {
			const inputJson = {
				topic_id: this.formGroupArray[value - 1].formGroup.value.st_topic_id
			};
			this.smartService.downloadSubTopicExcel(inputJson)
				.subscribe(
					(excel_r: any) => {
						if (excel_r && excel_r.status === 'ok') {
							const length = excel_r.data.split('/').length;
							saveAs(excel_r.data, excel_r.data.split('/')[length - 1]);
							this.resetForm(this.configValue);
						}
					});

		}
	}

	UploadTopic() {
		this.XlslArray = [];
		this.finalXlsTopicArray = [];
		const fileReader = new FileReader();
		fileReader.onload = (e) => {
			this.arrayBuffer = fileReader.result;
			const data = new Uint8Array(this.arrayBuffer);
			const arr = new Array();
			// tslint:disable-next-line: curly
			for (let i = 0; i !== data.length; ++i) arr[i] = String.fromCharCode(data[i]);
			const bstr = arr.join('');
			const workbook = XLSX.read(bstr, { type: 'binary' });
			const first_sheet_name = workbook.SheetNames[0];
			const worksheet = workbook.Sheets[first_sheet_name];
			this.XlslArray = XLSX.utils.sheet_to_json(worksheet, { raw: true });
			if (this.XlslArray.length === 0) {
				this.commonService.showSuccessErrorMessage('Execel is blank. Please Choose another excel.', 'error');
				return false;
			}
			const inputJson = { 'topic_data': this.XlslArray };
			this.smartService.uploadTopicExcel(inputJson)
				.subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.commonService.showSuccessErrorMessage(result.message, 'success');
							this.getTopic(this);
						} else {
							this.commonService.showSuccessErrorMessage(result.message, 'error');
						}
					});
		};
		fileReader.readAsArrayBuffer(this.file);

	}

	UploadSubTopic() {
		this.XlslArray = [];
		this.finalXlsTopicArray = [];
		const fileReader = new FileReader();
		fileReader.onload = (e) => {
			this.arrayBuffer = fileReader.result;
			const data = new Uint8Array(this.arrayBuffer);
			const arr = new Array();
			// tslint:disable-next-line: curly
			for (let i = 0; i !== data.length; ++i) arr[i] = String.fromCharCode(data[i]);
			const bstr = arr.join('');
			const workbook = XLSX.read(bstr, { type: 'binary' });
			const first_sheet_name = workbook.SheetNames[0];
			const worksheet = workbook.Sheets[first_sheet_name];
			this.XlslArray = XLSX.utils.sheet_to_json(worksheet, { raw: true });
			if (this.XlslArray.length === 0) {
				this.commonService.showSuccessErrorMessage('Execel is blank. Please Choose another excel.', 'error');
				return false;
			}
			for (let i = 0; i < this.XlslArray.length; i++) {
				const topic_id = this.XlslArray[i].TOPIC_ID ? this.XlslArray[i].TOPIC_ID.split('-')[0] : '0';
				const subtopic_name = this.XlslArray[i].SUBTOPIC_NAME ? this.XlslArray[i].SUBTOPIC_NAME : '';
				this.finalXlsTopicArray.push({
					TOPIC_ID: topic_id,
					SUBTOPIC_NAME: subtopic_name
				});
			}
			const inputJson = { 'subtopic_data': this.finalXlsTopicArray };
			this.smartService.uploadSubTopicExcel(inputJson)
				.subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.commonService.showSuccessErrorMessage(result.message, 'success');
							this.getSubTopic(this);
						} else {
							this.commonService.showSuccessErrorMessage(result.message, 'error');
						}
					});
		};
		fileReader.readAsArrayBuffer(this.file);

	}

}
