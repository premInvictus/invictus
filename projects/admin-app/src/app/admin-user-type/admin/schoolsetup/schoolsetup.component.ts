import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../../admin/services/admin.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AcsetupService } from '../../../acsetup/service/acsetup.service';
import { NotificationService } from 'projects/axiom/src/app/_services/notification.service';
import { appConfig } from 'projects/axiom/src/app/app.config';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { Element } from './school.model';
import { QelementService } from '../../../questionbank/service/qelement.service';
import { AdminUserAccessModalComponent } from '../../../shared-module/admin-user-access-model/admin-user-access-model.component';
import { SupportLoginModalComponent } from '../../../shared-module/support-login-model/support-login-model.component';
@Component({
	selector: 'app-schoolsetup',
	templateUrl: './schoolsetup.component.html',
	styleUrls: ['./schoolsetup.component.css']
})
export class SchoolsetupComponent implements OnInit {
	school_manage_form: FormGroup;
	regions: any[] = [
		'Uttar Pradesh',
		'Jharkhand',
		'Bihar',
		'West Bengal',
		'Orissa'
	];
	boards: any[] = [
		'Central Board of Secondary Eduction',
		'Bihar School Examination Board',
		'Jharkhand Academic Council',
		'Council for the Indian School Certificate Examinations'
	];
	schools: any[] = ['St. Xavier High School Deoghar', '	Invictus Demo School'];
	schoolSetupDiv = true;
	createNewSchoolDiv = false;
	editNewSchoolActive = false;
	newSchoolForm: FormGroup;
	arrayBoard: any[] = [];
	arrayCountry: any[] = [];
	arrayState: any[] = [];
	arrayCity: any[] = [];
	cityCountryArray: any[] = [];
	url: any;
	furl: any;
	hosturl = appConfig.apiUrl;
	file1: any = 'https://invictus-data.s3.ap-south-1.amazonaws.com/invictus/sis/documents/logo/document_150_1582010338.png';
	file2: any = 'https://invictus-data.s3.ap-south-1.amazonaws.com/invictus/sis/documents/favicon/document_50_1582010449.png';
	prefixStatus: string;
	prefixStatusicon: string;
	loading = false;
	school_setup_form: FormGroup;
	schooldetailsArray: any[] = [];
	ELEMENT_DATA: Element[] = [];
	@ViewChild(MatPaginator)
	paginator: MatPaginator;
	@ViewChild(MatSort)
	sort: MatSort;
	themeArray: any[] = [{ school_theme: '1', school_theme_name: 'Theme 1' },
	{ school_theme: '2', school_theme_name: 'Theme 2' }];
	startMonthArray: any[] = [];
	endMonthArray: any[] = [];
	feePeriodArray: any[] = [];
	currentImage: any;
	documentsArray: any[] = [];
	finalDocumentArray: any[] = [];
	currentFileChangeEvent: any;
	multipleFileArray: any[] = [];
	counter: any = 0;
	documentPath: any;
	city_id: any;
	displayedColumns = [
		'position',
		'logo',
		'schoolname',
		'schoolprefix',
		'board',
		'affiliation',
		'address',
		'city',
		'pin',
		'contact',
		'email',
		'manager',
		'status',
		'action'
	];
	dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
	monthArray: any[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
	invictusUserData:any[] = [];
	schoolGroupData:any[]= [];
	si_data_sync  = '0';
	constructor(
		private adminService: AdminService,
		private acsetupService: AcsetupService,
		private fb: FormBuilder,
		private notif: NotificationService,
		private qlementService: QelementService,
		private dialog: MatDialog   
	) { }

	applyFilter(filterValue: string) {
		filterValue = filterValue.trim().toLowerCase();
		this.dataSource.filter = filterValue;
	}

	ngOnInit() {
		this.getSchoolDetails(this);
		this.buildForm();
		this.getInvictusUser();
		this.getSchoolGroups();
		this.getBoard();
		this.getCountry();
		this.getState();
		this.getFeePeriods();
		for (let i = 0; i < 12; i++) {
			this.startMonthArray.push({
				school_session_start_month: i + 1,
				school_session_start_month_name: this.monthArray[i]
			});
			this.endMonthArray.push({
				school_session_end_month: i + 1,
				school_session_end_month_name: this.monthArray[i]
			});
		}
	}

	buildForm() {
		this.newSchoolForm = this.fb.group({
			school_id: '',
			school_logo: '',
			school_favicon: '',
			school_name: '',
			school_board: '',
			school_afflication_no: '',
			school_branch: '',
			school_address: '',
			school_country: '',
			school_state: '',
			school_city: '',
			school_website: '',
			si_pincode: '',
			school_phone: '',
			school_smsid: '',
			school_email: '',
			school_hindi_font: '',
			school_prefix: '',
			school_total_students: '',
			school_manager: '',
			school_theme: '',
			school_session_start_month: '',
			school_session_end_month: '',
			school_fee_period: '',
			school_group:'',
			school_group_text:'',
			school_esi:'',
			school_pf:'',
			school_tan:''
		});
	}
	getFeePeriods() {
		this.qlementService.getFeePeriods({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.feePeriodArray = result.data;
			}
		});
	}
	getSchoolDetails(that) {
		that.userdetailArray = [];
		that.ELEMENT_DATA = [];
		that.adminService.getSchoolDetails().subscribe((result: any) => {
			if (result && result.status === 'ok') {
				that.schooldetailsArray = result.data;
				let ind = 1;
				for (const t of that.schooldetailsArray) {
					that.ELEMENT_DATA.push({
						position: ind,
						logo: t.school_logo,
						schoolname: t.school_name,
						schoolprefix: t.school_prefix,
						board: t.school_board,
						affiliation: t.school_afflication_no,
						address: t.school_address,
						pin: t.si_pincode,
						contact: t.school_phone,
						city: t.school_city,
						email: t.school_email,
						manager: t.school_website,
						action: t,
					});
					ind++;
				}
				that.dataSource = new MatTableDataSource<Element>(that.ELEMENT_DATA);
				that.dataSource.paginator = that.paginator;
				that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
				that.dataSource.sort = that.sort;
			} else {
				that.notif.showSuccessErrorMessage('No records found', 'error');
			}
		});
	}

	readUrl(event: any) {
		if (event.target.files && event.target.files[0]) {
			const reader = new FileReader();

			// tslint:disable-next-line:no-shadowed-variable
			reader.onload = (event: any) => {
				this.url = event.target.result;
			};

			reader.readAsDataURL(event.target.files[0]);
		}
	}

	readfUrl(event: any) {
		if (event.target.files && event.target.files[0]) {
			const reader = new FileReader();

			// tslint:disable-next-line:no-shadowed-variable
			reader.onload = (event: any) => {
				this.furl = event.target.result;
			};

			reader.readAsDataURL(event.target.files[0]);
		}
	}

	schoolDetail(value: any) {
	}
	openCreateNewSchoolDiv() {
		this.createNewSchoolDiv = true;
		this.schoolSetupDiv = false;
		this.resetNewSchoolForm();
	}
	uploadSchoolLogo(fileInput) {
		if (fileInput.target.files.length > 0) {
			this.multipleFileArray = [];
			this.counter = 0;
			this.currentFileChangeEvent = fileInput;
			const files = fileInput.target.files;
			for (let i = 0; i < files.length; i++) {
				this.uploadLogo(files[i]);
			}
		}
	}
	uploadLogo(files) {
		const reader = new FileReader();
		reader.onloadend = (e) => {
			this.currentImage = reader.result;
			const fileJson = {
				fileName: files.name,
				imagebase64: this.currentImage,
				module: 'logo'
			};
			this.multipleFileArray.push(fileJson);
			this.counter++;
			if (this.counter === this.currentFileChangeEvent.target.files.length) {
				this.adminService.uploadDocuments(this.multipleFileArray).subscribe((result: any) => {
					if (result) {
						this.file1 = result.data[0].file_url;
					}
				});
			}
		};
		reader.readAsDataURL(files);
	}
	uploadSchoolFavicon(fileInput) {
		if (fileInput.target.files.length > 0) {
			this.multipleFileArray = [];
			this.counter = 0;
			this.currentFileChangeEvent = fileInput;
			const files = fileInput.target.files;
			for (let i = 0; i < files.length; i++) {
				this.uploadSchoolIcon(files[i]);
			}
		}
	}
	uploadSchoolIcon(files) {
		const reader = new FileReader();
		reader.onloadend = (e) => {
			this.currentImage = reader.result;
			const fileJson = {
				fileName: files.name,
				imagebase64: this.currentImage,
				module: 'favicon'
			};
			this.multipleFileArray.push(fileJson);
			this.counter++;
			if (this.counter === this.currentFileChangeEvent.target.files.length) {
				this.adminService.uploadDocuments(this.multipleFileArray).subscribe((result: any) => {
					if (result) {
						this.file2 = result.data[0].file_url;
					}
				});
			}
		};
		reader.readAsDataURL(files);
	}

	checkPrefix() {

		if (this.newSchoolForm.value.school_prefix) {
			this.adminService
				.checkPrefix(this.newSchoolForm.value.school_prefix.toLowerCase())
				.subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.prefixStatus = result.data;
						this.prefixStatusicon = 'fas fa-check text-success';
					} else {
						this.prefixStatusicon = 'fas fa-times text-danger';
						this.prefixStatus = result.data;
					}
				});
		}
	}
	validateForm(){
		let validate = true;
		if (!this.newSchoolForm.value.school_logo) {
			this.notif.showSuccessErrorMessage('Logo is required', 'info');
		}
		if (!this.newSchoolForm.value.school_name) {
			this.notif.showSuccessErrorMessage('School Name is required', 'error');
			validate = false;
		}
		if (!this.newSchoolForm.value.school_board) {
			this.notif.showSuccessErrorMessage('Board is required', 'error');
			validate = false;
		}
		if (!this.newSchoolForm.value.school_afflication_no) {
			this.notif.showSuccessErrorMessage('Affiliation No. is required', 'error');
			validate = false;
		}
		if (!this.newSchoolForm.value.school_address) {
			this.notif.showSuccessErrorMessage('Address is required', 'error');
			validate = false;
		}
		if (!this.newSchoolForm.value.school_city) {
			this.notif.showSuccessErrorMessage('City is required', 'error');
			validate = false;
		}
		if (!this.newSchoolForm.value.school_state) {
			this.notif.showSuccessErrorMessage('State is required', 'error');
			validate = false;
		}
		if (!this.newSchoolForm.value.school_country) {
			this.notif.showSuccessErrorMessage('Country is required', 'error');
			validate = false;
		}
		if (!this.newSchoolForm.value.school_favicon) {
			this.notif.showSuccessErrorMessage('School Favicon is required', 'info');
		}
		if (!this.newSchoolForm.value.school_website) {
			this.notif.showSuccessErrorMessage('School Website is required', 'error');
			validate = false;
		}
		if (!this.newSchoolForm.value.school_phone) {
			this.notif.showSuccessErrorMessage('Contact No. is required', 'error');
			validate = false;
		}
		if (!this.newSchoolForm.value.school_smsid) {
			this.notif.showSuccessErrorMessage('SMS ID is required', 'error');
			validate = false;
		}
		if (!this.newSchoolForm.value.school_email) {
			this.notif.showSuccessErrorMessage('Email ID is required', 'error');
		}
		if (!this.newSchoolForm.value.school_prefix) {
			this.notif.showSuccessErrorMessage('Assigned Prefix is required', 'error');
			validate = false;
		}
		if (!this.newSchoolForm.value.si_pincode) {
			this.notif.showSuccessErrorMessage('Pin Code is required', 'error');
			validate = false;
		}
		if (!this.newSchoolForm.value.school_theme) {
			this.notif.showSuccessErrorMessage('Theme is required', 'error');
			validate = false;
		}
		if (!this.newSchoolForm.value.school_fee_period) {
			this.notif.showSuccessErrorMessage('Fee period is required', 'error');
			validate = false;
		}
		if (!this.newSchoolForm.value.school_session_start_month) {
			this.notif.showSuccessErrorMessage('Start Month is required', 'error');
			validate = false;
		}
		if (!this.newSchoolForm.value.school_session_end_month) {
			this.notif.showSuccessErrorMessage('End Month is required', 'error');
			validate = false;
		}
		if (this.newSchoolForm.value.school_group == 'other' && this.newSchoolForm.value.school_group_text == '') {
			this.notif.showSuccessErrorMessage('School Group is required', 'error');
			validate = false;
		}
		return validate;
	}
	addNewSchool() {
		if (this.newSchoolForm.valid && this.validateForm()) {
			const city = this.getCityId(this.newSchoolForm.value.school_city);
			const newSchoolFormData = new FormData();
			newSchoolFormData.append('school_logo', this.file1);
			newSchoolFormData.append('school_favicon', this.file2);
			newSchoolFormData.append(
				'school_name',
				this.newSchoolForm.value.school_name
			);
			newSchoolFormData.append(
				'school_board',
				this.newSchoolForm.value.school_board
			);
			newSchoolFormData.append(
				'school_afflication_no',
				this.newSchoolForm.value.school_afflication_no
			);
			newSchoolFormData.append(
				'school_branch',
				this.newSchoolForm.value.school_branch
			);
			newSchoolFormData.append(
				'school_address',
				this.newSchoolForm.value.school_address
			);
			newSchoolFormData.append(
				'school_country',
				this.newSchoolForm.value.school_country
			);
			newSchoolFormData.append(
				'school_state',
				this.newSchoolForm.value.school_state
			);
			newSchoolFormData.append(
				'school_city',
				city
			);
			newSchoolFormData.append(
				'school_website',
				this.newSchoolForm.value.school_website
			);
			newSchoolFormData.append(
				'school_phone',
				this.newSchoolForm.value.school_phone
			);
			newSchoolFormData.append(
				'school_smsid',
				this.newSchoolForm.value.school_smsid
			);
			newSchoolFormData.append(
				'school_esi',
				this.newSchoolForm.value.school_esi
			);
			newSchoolFormData.append(
				'school_pf',
				this.newSchoolForm.value.school_pf
			);
			newSchoolFormData.append(
				'school_tan',
				this.newSchoolForm.value.school_tan
			);
			newSchoolFormData.append(
				'school_email',
				this.newSchoolForm.value.school_email
			);
			newSchoolFormData.append(
				'school_hindi_font',
				this.newSchoolForm.value.school_hindi_font
			);
			newSchoolFormData.append(
				'school_prefix',
				this.newSchoolForm.value.school_prefix.toLowerCase()
			);
			newSchoolFormData.append(
				'school_total_students',
				this.newSchoolForm.value.school_total_students
			);
			newSchoolFormData.append(
				'school_manager',
				JSON.stringify(this.newSchoolForm.value.school_manager)
			);
			newSchoolFormData.append(
				'school_theme',
				this.newSchoolForm.value.school_theme
			);
			newSchoolFormData.append(
				'school_fee_period',
				this.newSchoolForm.value.school_fee_period
			);
			newSchoolFormData.append(
				'school_session_start_month',
				this.newSchoolForm.value.school_session_start_month
			);
			newSchoolFormData.append(
				'school_session_end_month',
				this.newSchoolForm.value.school_session_end_month
			);
			newSchoolFormData.append(
				'si_pincode',
				this.newSchoolForm.value.si_pincode
			);
			newSchoolFormData.append(
				'school_group',
				(this.newSchoolForm.value.school_group_text ? this.newSchoolForm.value.school_group_text : this.newSchoolForm.value.school_group )
			);
			newSchoolFormData.append(
				
				'si_data_sync',this.si_data_sync
			);
			this.adminService.addSchool(newSchoolFormData).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.notif.showSuccessErrorMessage('School Added Successfully', 'success');
						this.adminService.importSampleDataForSchool({ school_prefix: this.newSchoolForm.value.school_prefix.toLowerCase() }).subscribe(
							(result1: any) => {
								if (result1 && result1.status === 'ok') {
									this.notif.showSuccessErrorMessage('Data is populated', 'success');
									this.newSchoolForm.reset();
									this.createNewSchoolDiv = false;
									this.schoolSetupDiv = true;
								}
							}
						);
					}
				});
		}
	}

	getBoard() {
		this.acsetupService.getBoard().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.arrayBoard = result.data;
				}
			}
		);
	}
	getCountry() {
		this.acsetupService.getCountry().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.arrayCountry = result.data;
				}
			}
		);
	}
	getState() {
		this.acsetupService.getState().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.arrayState = result.data;
				}
			}
		);
	}
	resetNewSchoolForm() {
		this.file1 = 'https://invictus-data.s3.ap-south-1.amazonaws.com/invictus/sis/documents/logo/document_150_1582010338.png';
		this.file2 = 'https://invictus-data.s3.ap-south-1.amazonaws.com/invictus/sis/documents/favicon/document_50_1582010449.png';
		this.newSchoolForm.patchValue({
			school_id: '',
			school_logo: '',
			school_favicon: '',
			school_name: '',
			school_board: '',
			school_afflication_no: '',
			school_branch: '',
			school_address: '',
			school_country: '',
			school_state: '',
			si_pincode: '',
			school_city: '',
			school_website: '',
			school_phone: '',
			school_smsid: '',
			school_email: '',
			school_hindi_font: '',
			school_prefix: '',
			school_total_students: '',
			school_manager: '',
			school_theme: '',
			school_session_start_month: '',
			school_session_end_month: '',
			school_fee_period: '',
			school_group:'',
			school_group_text:'',
			school_esi: '',
			school_pf: '',
			school_tan: '',
		});
	}
	editNewSchoolForm(value: any) {
		console.log('value--', value)
		this.createNewSchoolDiv = true;
		this.schoolSetupDiv = false;
		this.editNewSchoolActive = true;
		this.file1 = value.school_logo;
		this.file2 = value.school_favicon;
		this.city_id = value.school_city_id;
		this.si_data_sync = value.si_data_sync;
		this.newSchoolForm.patchValue({
			school_id: value.school_id,
			school_logo: '',
			school_favicon: '',
			school_name: value.school_name,
			school_board: value.school_board_id,
			school_afflication_no: value.school_afflication_no,
			school_branch: value.school_branch,
			school_address: value.school_address,
			school_country: value.school_country_id,
			school_state: value.school_state_id,
			school_city: value.school_city,
			si_pincode: value.si_pincode,
			school_website: value.school_website,
			school_phone: value.school_phone,
			school_smsid: value.school_smsid,
			school_email: value.school_email,
			school_hindi_font: value.school_hindi_font,
			school_prefix: value.school_prefix,
			school_total_students: value.school_total_students,
			school_manager: value.school_manager ? JSON.parse(value.school_manager) : [],
			school_theme: value.school_theme,
			school_session_start_month: Number(value.session_start_month),
			school_session_end_month: Number(value.session_end_month),
			school_fee_period: value.school_fee_period,
			school_group: value.si_group,
			school_group_text: value.si_group,
			school_esi: value.school_esi,
			school_pf: value.school_pf,
			school_tan: value.school_tan,
		});
		console.log('this.newSchoolForm--',this.newSchoolForm)
	}
	editNewSchool() {
		if (this.newSchoolForm.valid && this.validateForm()) {
			const newSchoolFormData = new FormData();
			newSchoolFormData.append('school_logo', this.file1);
			newSchoolFormData.append('school_favicon', this.file2);
			newSchoolFormData.append('school_id', this.newSchoolForm.value.school_id);
			newSchoolFormData.append(
				'school_prefix',
				this.newSchoolForm.value.school_prefix
			);
			newSchoolFormData.append(
				'school_name',
				this.newSchoolForm.value.school_name
			);
			newSchoolFormData.append(
				'school_board',
				this.newSchoolForm.value.school_board
			);
			newSchoolFormData.append(
				'school_afflication_no',
				this.newSchoolForm.value.school_afflication_no
			);
			newSchoolFormData.append(
				'school_branch',
				this.newSchoolForm.value.school_branch
			);
			newSchoolFormData.append(
				'school_address',
				this.newSchoolForm.value.school_address
			);
			newSchoolFormData.append(
				'school_country',
				this.newSchoolForm.value.school_country
			);
			newSchoolFormData.append(
				'school_state',
				this.newSchoolForm.value.school_state
			);
			newSchoolFormData.append(
				'school_city',
				this.city_id
			);
			newSchoolFormData.append(
				'school_website',
				this.newSchoolForm.value.school_website
			);
			newSchoolFormData.append(
				'school_phone',
				this.newSchoolForm.value.school_phone
			);
			newSchoolFormData.append(
				'school_smsid',
				this.newSchoolForm.value.school_smsid
			);
			newSchoolFormData.append(
				'school_esi',
				this.newSchoolForm.value.school_esi
			);
			newSchoolFormData.append(
				'school_pf',
				this.newSchoolForm.value.school_pf
			);
			newSchoolFormData.append(
				'school_tan',
				this.newSchoolForm.value.school_tan
			);
			newSchoolFormData.append(
				'school_email',
				this.newSchoolForm.value.school_email
			);
			newSchoolFormData.append(
				'school_hindi_font',
				this.newSchoolForm.value.school_hindi_font
			);
			// newSchoolFormData.append('school_prefix',this.newSchoolForm.value.school_prefix);
			newSchoolFormData.append(
				'school_total_students',
				this.newSchoolForm.value.school_total_students
			);
			newSchoolFormData.append(
				'school_manager',
				JSON.stringify(this.newSchoolForm.value.school_manager)
			);
			newSchoolFormData.append(
				'school_theme',
				this.newSchoolForm.value.school_theme
			);
			newSchoolFormData.append(
				'school_fee_period',
				this.newSchoolForm.value.school_fee_period
			);
			newSchoolFormData.append(
				'school_session_start_month',
				this.newSchoolForm.value.school_session_start_month
			);
			newSchoolFormData.append(
				'school_session_end_month',
				this.newSchoolForm.value.school_session_end_month
			);
			newSchoolFormData.append(
				'si_pincode',
				this.newSchoolForm.value.si_pincode
			);
			newSchoolFormData.append(
				'school_group',
				(this.newSchoolForm.value.school_group_text ? this.newSchoolForm.value.school_group_text : this.newSchoolForm.value.school_group )
			);
			newSchoolFormData.append(
				
				'si_data_sync',this.si_data_sync
			);
			console.log('newSchoolFormData--', newSchoolFormData, this.newSchoolForm)
			this.adminService.editSchool(newSchoolFormData).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						alert(result.data);
						this.createNewSchoolDiv = false;
						this.schoolSetupDiv = true;
						this.getSchoolDetails(this);
					}
				}
			);
		}
	}

	deleteNewSchool(value: any) {
		const param: any = {};
		param.school_id = value;
		param.si_status = '5';
		this.adminService.deleteSchool(param).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					alert(result.data);
				}
			}
		);
	}
	getSchoolStatusColor(value) {
		if (value === 1) {
			return 'green';
		} else {
			return 'red';
		}
	}
	filterCityStateCountry($event) {
		if (Number($event.keyCode) !== 40 && Number($event.keyCode) !== 38) {
			if ($event.target.value !== '' && $event.target.value.length >= 3) {
				this.cityCountryArray = [];
				this.acsetupService.getStateCountryByCity({ cit_name: $event.target.value }).subscribe((result: any) => {
					if (result.status === 'ok') {
						this.cityCountryArray = result.data;
					}
				});
			}
		}
	}
	getCityPerId(item: any) {
		this.city_id = item.cit_id;
		this.newSchoolForm.patchValue({
			school_city: this.getCityName(item.cit_id),
			school_state: item.sta_id,
			school_country: item.cou_id
		});
	}
	getCityName(id) {
		const findIndex = this.cityCountryArray.findIndex(f => f.cit_id === id);
		if (findIndex !== -1) {
			return this.cityCountryArray[findIndex].cit_name;
		}
	}
	getCityId(name) {
		const findIndex = this.cityCountryArray.findIndex(f => f.cit_name === name);
		if (findIndex !== -1) {
			return this.cityCountryArray[findIndex].cit_id;
		}
	}
	toggleLodStatus(value: any) {
		console.log(value);
		if (value.school_status == '1') {
			value.school_status = '0';
		} else {
			value.school_status = '1';
		}
		this.adminService.editSchoolstatus(value).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.getSchoolDetails(this);
				}
			}
		);
	}

	toggleDataSync() {
		if(this.si_data_sync == '1') {
			this.si_data_sync = '0';
		} else {
			this.si_data_sync = '1';
		}
	}

	manageSchoolUser(item) {
		console.log('item--',item);
		this.adminService.getSchoolAdminUsers(item).subscribe((result:any) => {
			const dialogRef = this.dialog.open(AdminUserAccessModalComponent, {
				height: '520px',
				width: '800px',
				data: {
			title: 'Manage Admin User Access',
	        apiData:{result, schoolprefix:item.schoolprefix}   
		  }
			});
			dialogRef.afterClosed().subscribe(dresult => {
				console.log(dresult);
				//this.getAccounts();
			});
		})
	}

	

	getInvictusUser() {
		this.invictusUserData = [];
		this.adminService.getAllUsers().subscribe((data:any)=>{
			if (data && data.status == 'ok') {
				this.invictusUserData = data.data;
				console.log('this.invictusUserData--', this.invictusUserData);
			}
		})
	}

	getSchoolGroups() {
		
		this.schoolGroupData = [];
		this.adminService.getAllSchoolGroups({}).subscribe((data:any)=>{
			if (data && data.status == 'ok') {
				this.schoolGroupData = data.data;
				console.log('this.schoolGroupData--', this.schoolGroupData);
			}
		})
	}
	setGroup(event){
		this.newSchoolForm.patchValue({
			school_group_text:event.value
		})
	}
}
