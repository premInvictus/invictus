import { Component, OnInit, Inject } from '@angular/core';
import { SisService } from '../../_services/sis.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
	selector: 'app-search-via-name',
	templateUrl: './search-via-name.component.html',
	styleUrls: ['./search-via-name.component.css']
})
export class SearchViaNameComponent implements OnInit {
	searchStudent = false;
	shouldSizeUpdate: boolean;
	studentArrayByName: any[] = [];
	constructor(private sisService: SisService,
		public dialogRef: MatDialogRef<SearchViaNameComponent>,
		@Inject(MAT_DIALOG_DATA) data: any) {
			this.shouldSizeUpdate = data.shouldSizeUpdate;
		 }

	ngOnInit() {
	}
	searchStudentByName(value) {
		if (value) {
			this.sisService.getStudentDataPerName({ stu_name: value }).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.studentArrayByName = [];
					this.studentArrayByName = result.data;
					this.searchStudent = true;
					this.updateSizeForData();
					document.getElementById('search').blur();
				}  else {
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
	updateSizeForData() {
		this.dialogRef.updateSize('60%', '60vh');
	}
	updateSizeForNoData() {
		this.dialogRef.updateSize('60%', '40vh');
	}


}
