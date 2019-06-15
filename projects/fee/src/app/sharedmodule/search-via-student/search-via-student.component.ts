import { Component, OnInit, Inject } from '@angular/core';
import { FeeService } from '../../_services/fee.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'app-search-via-student',
	templateUrl: './search-via-student.component.html',
	styleUrls: ['./search-via-student.component.css']
})
export class SearchViaStudentComponent implements OnInit {
	shouldSizeUpdate: boolean;
	searchStudent = false;
	studentArrayByName: any[] = [];
	constructor(private feeService: FeeService,
		public dialogRef: MatDialogRef<SearchViaStudentComponent>,
		@Inject(MAT_DIALOG_DATA) data: any) {
			this.shouldSizeUpdate = data.shouldSizeUpdate;
		 }

	ngOnInit() {
	}
	searchStudentByName(value) {
		if (value) {
			this.feeService.getStudentDataPerName({ stu_name: value }).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.studentArrayByName = [];
					this.studentArrayByName = result.data;
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
		this.dialogRef.updateSize('60%', '60vh');
	}
	updateSizeForNoData() {
		this.dialogRef.updateSize('60%', '40vh');
	}

}
