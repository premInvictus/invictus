import { Component, OnInit, Inject } from '@angular/core';
import { SisService, CommonAPIService } from '../../_services/index';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-search-via-name',
  templateUrl: './search-via-name.component.html',
  styleUrls: ['./search-via-name.component.scss']
})
export class SearchViaNameComponent implements OnInit {
  searchStudent = false;
  shouldSizeUpdate: boolean;
  studentArrayByName: any[] = [];
  constructor(private CommonAPIService: CommonAPIService,
    public dialogRef: MatDialogRef<SearchViaNameComponent>,
    @Inject(MAT_DIALOG_DATA) data: any) {
    this.shouldSizeUpdate = data.shouldSizeUpdate;
  }

  ngOnInit() {
  }
  searchStudentByName(value) {
    if (value) {
      const inputJson = {
        "filters": [
          {
            "filter_type": "emp_name",
            "filter_value": value,
            "type": "text"
          }
        ]
      };
      this.CommonAPIService.getFilterData(inputJson).subscribe((result: any) => {
        if (result && result.status === 'ok') {
          console.log(result.data);
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
  setId(item, emp_code_no) {
    this.dialogRef.close({ emp_code_no: emp_code_no, emp_id :item.emp_id });
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
