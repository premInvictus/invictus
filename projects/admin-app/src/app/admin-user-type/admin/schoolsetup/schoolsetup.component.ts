import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../../admin/services/admin.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AcsetupService } from '../../../acsetup/service/acsetup.service';
import { NotificationService } from 'projects/axiom/src/app/_services/notification.service';
import { appConfig } from 'projects/axiom/src/app/app.config';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Element } from './school.model';
import { QelementService } from '../../../questionbank/service/qelement.service';

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
	private file1: File;
	private file2: File;
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
	displayedColumns = [
		'position',
		'logo',
		'schoolname',
		'schoolprefix',
		'board',
		'affiliation',
		'address',
		'city',
		'contact',
		'email',
		'manager',
		'action'
	];
	dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
	monthArray: any[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
	constructor(
		private adminService: AdminService,
		private acsetupService: AcsetupService,
		private fb: FormBuilder,
		private notif: NotificationService,
		private qlementService: QelementService
	) { }

	applyFilter(filterValue: string) {
		filterValue = filterValue.trim().toLowerCase();
		this.dataSource.filter = filterValue;
	}

	ngOnInit() {
		this.getSchoolDetails(this);
		this.buildForm();
		this.buildForm();
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
			school_fee_period: ''
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
	}
	uploadSchoolLogo(event) {
		if (event.target.files.length > 0) {
			this.file1 = event.target.files[0];
		}
	}
	uploadSchoolFavicon(event) {
		if (event.target.files.length > 0) {
			this.file2 = event.target.files[0];
		}
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
	addNewSchool() {
		if (!this.newSchoolForm.value.school_logo) {
			this.notif.showSuccessErrorMessage('Logo is required', 'info');
		}
		if (!this.newSchoolForm.value.school_name) {
			this.notif.showSuccessErrorMessage('School Name is required', 'error');
		}
		if (!this.newSchoolForm.value.school_board) {
			this.notif.showSuccessErrorMessage('Board is required', 'error');
		}
		if (!this.newSchoolForm.value.school_afflication_no) {
			this.notif.showSuccessErrorMessage('Affiliation No. is required', 'error');
		}
		if (!this.newSchoolForm.value.school_address) {
			this.notif.showSuccessErrorMessage('Address is required', 'error');
		}
		if (!this.newSchoolForm.value.school_city) {
			this.notif.showSuccessErrorMessage('City is required', 'error');
		}
		if (!this.newSchoolForm.value.school_state) {
			this.notif.showSuccessErrorMessage('State is required', 'error');
		}
		if (!this.newSchoolForm.value.school_country) {
			this.notif.showSuccessErrorMessage('Country is required', 'error');
		}
		if (!this.newSchoolForm.value.school_favicon) {
			this.notif.showSuccessErrorMessage('School Favicon is required', 'info');
		}
		if (!this.newSchoolForm.value.school_website) {
			this.notif.showSuccessErrorMessage('School Website is required', 'error');
		}
		if (!this.newSchoolForm.value.school_phone) {
			this.notif.showSuccessErrorMessage('Contact No. is required', 'error');
		}
		if (!this.newSchoolForm.value.school_smsid) {
			this.notif.showSuccessErrorMessage('SMS ID is required', 'error');
		}
		if (!this.newSchoolForm.value.school_email) {
			this.notif.showSuccessErrorMessage('Email ID is required', 'error');
		}
		if (!this.newSchoolForm.value.school_prefix) {
			this.notif.showSuccessErrorMessage('Assigned Prefix is required', 'error');
		}
		if (!this.newSchoolForm.value.school_theme) {
			this.notif.showSuccessErrorMessage('Theme is required', 'error');
		}
		if (!this.newSchoolForm.value.school_fee_period) {
			this.notif.showSuccessErrorMessage('Fee period is required', 'error');
		}
		if (!this.newSchoolForm.value.school_session_start_month) {
			this.notif.showSuccessErrorMessage('Start Month is required', 'error');
		}
		if (!this.newSchoolForm.value.school_session_end_month) {
			this.notif.showSuccessErrorMessage('End Month is required', 'error');
		}
		if (this.newSchoolForm.valid) {
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
				this.newSchoolForm.value.school_manager
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
		this.newSchoolForm.controls.school_name.setValue('');
		this.newSchoolForm.controls.school_board.setValue('');
		this.newSchoolForm.controls.school_afflication_no.setValue('');
		this.newSchoolForm.controls.school_branch.setValue('');
		this.newSchoolForm.controls.school_address.setValue('');
		this.newSchoolForm.controls.school_country.setValue('');
		this.newSchoolForm.controls.school_state.setValue('');
		this.newSchoolForm.controls.school_city.setValue('');
		this.newSchoolForm.controls.school_website.setValue('');
		this.newSchoolForm.controls.school_phone.setValue('');
		this.newSchoolForm.controls.school_smsid.setValue('');
		this.newSchoolForm.controls.school_email.setValue('');
		this.newSchoolForm.controls.school_hindi_font.setValue('');
		this.newSchoolForm.controls.school_prefix.setValue('');
		this.newSchoolForm.controls.school_manager.setValue('');
		this.file1 = null;
		this.file2 = null;
	}
	editNewSchoolForm(value: any) {
		this.createNewSchoolDiv = true;
		this.schoolSetupDiv = false;
		this.editNewSchoolActive = true;
		this.file1 = null;
		this.file2 = null;
		this.newSchoolForm.controls.school_id.setValue(value.school_id);
		this.newSchoolForm.controls.school_name.setValue(value.school_name);
		this.newSchoolForm.controls.school_board.setValue(value.school_board_id);
		this.newSchoolForm.controls.school_afflication_no.setValue(
			value.school_afflication_no
		);
		this.newSchoolForm.controls.school_branch.setValue(value.school_branch);
		this.newSchoolForm.controls.school_address.setValue(value.school_address);
		this.newSchoolForm.controls.school_country.setValue(
			value.school_country_id
		);
		this.newSchoolForm.controls.school_state.setValue(value.school_state_id);
		this.newSchoolForm.controls.school_city.setValue(value.school_city_id);
		this.newSchoolForm.controls.school_website.setValue(value.school_website);
		this.newSchoolForm.controls.school_phone.setValue(value.school_phone);
		this.newSchoolForm.controls.school_smsid.setValue(value.school_smsid);
		this.newSchoolForm.controls.school_email.setValue(value.school_email);
		this.newSchoolForm.controls.school_hindi_font.setValue(
			value.school_hindi_font
		);
		this.newSchoolForm.controls.school_prefix.setValue(value.school_prefix);
		this.newSchoolForm.controls.school_manager.setValue(value.school_manager);
	}
	editNewSchool() {
		if (this.newSchoolForm.valid) {
			const newSchoolFormData = new FormData();
			newSchoolFormData.append('school_logo', this.file1);
			newSchoolFormData.append('school_favicon', this.file2);
			newSchoolFormData.append('school_id', this.newSchoolForm.value.school_id);
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
				this.newSchoolForm.value.school_city
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
				this.newSchoolForm.value.school_manager
			);
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
		console.log(param);
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
}
