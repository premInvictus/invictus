import { Component, OnInit } from '@angular/core';
import { SisService } from '../../_services/sis.service';
import { MatDialogRef } from '@angular/material';
@Component({
	selector: 'app-search-via-name',
	templateUrl: './search-via-name.component.html',
	styleUrls: ['./search-via-name.component.css']
})
export class SearchViaNameComponent implements OnInit {
	searchStudent = false;
	studentArrayByName: any[] = [];
	constructor(private sisService: SisService,
		public dialogRef: MatDialogRef<SearchViaNameComponent>) { }

	ngOnInit() {
	}
	searchStudentByName(value) {
		if (value) {
			this.sisService.getStudentDataPerName({ stu_name: value }).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.studentArrayByName = [];
					this.studentArrayByName = result.data;
					this.searchStudent = true;
				}
			});
		}
	}
	getProcessType(type) {
		if (Number(type) === 1) {
			return 'Enquiry';
		} else if (Number(type) === 2) {
			return 'Registration';
		} else if (Number(type) === 3) {
			return 'Provisional';
		} else if (Number(type) === 4) {
			return 'Admission';
		} else {
			return 'Alumini';
		}
	}
	setId(id, type) {
		this.dialogRef.close({adm_no: id , process_type: type});
	}
	closeDialog() {
		this.dialogRef.close();
	}

}
