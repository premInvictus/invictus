import { Component, OnInit } from '@angular/core';
import { FeeService } from '../../_services/fee.service';
import { MatDialogRef } from '@angular/material';

@Component({
	selector: 'app-search-via-student',
	templateUrl: './search-via-student.component.html',
	styleUrls: ['./search-via-student.component.css']
})
export class SearchViaStudentComponent implements OnInit {

	searchStudent = false;
	studentArrayByName: any[] = [];
	constructor(private feeService: FeeService,
		public dialogRef: MatDialogRef<SearchViaStudentComponent>) { }

	ngOnInit() {
	}
	searchStudentByName(value) {
		if (value) {
			this.feeService.getStudentDataPerName({ stu_name: value }).subscribe((result: any) => {
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
