import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { SisService } from '../../_services/sis.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatSort } from '@angular/material';
@Component({
	selector: 'app-search-via-name',
	templateUrl: './search-via-name.component.html',
	styleUrls: ['./search-via-name.component.css']
})
export class SearchViaNameComponent implements OnInit, AfterViewInit {
	searchStudent = false;
	shouldSizeUpdate: boolean;
	studentArrayByName: any[] = [];
	ELEMENT_DATA: Element[]
	displayedColumns: string[] = ['sr_no', 'enrollment_no', 'name', 'class_section', 'parent_name', 'contact_no', 'enrollment_status'];
	dataSource = new MatTableDataSource<Element>();

	constructor(private sisService: SisService,
		public dialogRef: MatDialogRef<SearchViaNameComponent>,
		@Inject(MAT_DIALOG_DATA) data: any) {
		this.shouldSizeUpdate = data.shouldSizeUpdate;
	}

	@ViewChild(MatSort) sort: MatSort
	ngAfterViewInit() {
		this.sort.disableClear = true
		this.dataSource.sort = this.sort
	}

	ngOnInit() {
	}
	searchStudentByName(value) {
		if (value) {
			this.sisService.getStudentDataPerName({ stu_name: value }).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.studentArrayByName = [];
					this.studentArrayByName = result.data;
					this.getStudentData()
					this.searchStudent = true;
					this.updateSizeForData();
					document.getElementById('search').blur();
				} else {
					this.searchStudent = true;
					this.studentArrayByName = [];
					this.updateSizeForNoData();
					document.getElementById('search').blur();
				}
			});
		}
	}
	getProcessType(type) {
		if (Number(type) === 1) {
			return 'Enq';
		} else if (Number(type) === 2) {
			return 'Reg';
		} else if (Number(type) === 3) {
			return 'Prov Adm';
		} else if (Number(type) === 4) {
			return 'Adm';
		} else {
			return 'Alumini';
		}
	}
	setId(id, type) {
		this.dialogRef.close({ adm_no: id, process_type: type });
	}
	closeDialog() {
		this.dialogRef.close();
	}
	updateSizeForData() {
		this.dialogRef.updateSize('60%', '70vh');
	}
	updateSizeForNoData() {
		this.dialogRef.updateSize('60%', '40vh');
	}

	getStudentData() {
		let element: any = {}
		this.ELEMENT_DATA = []
		this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA)
		let pos = 1

		if (this.studentArrayByName.length > 0) {
			this.studentArrayByName.forEach((ele) => {
				element = {
					srno: pos,
					admission_no: ele.au_admission_no,
					name: ele.au_full_name,
					class_name: ele.class_name,
					sec_name: ele.sec_name,
					parent_name: ele.epd_parent_name,
					contact_no: ele.epd_contact_no,
					process_type: ele.au_process_type
				}
				this.ELEMENT_DATA.push(element)
				pos++
			})
		}
		this.dataSource.sort = this.sort
	}

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase()
	}
}
