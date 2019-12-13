import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
import { TitleCasePipe, DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';

@Component({
  selector: 'app-physical-verification',
  templateUrl: './physical-verification.component.html',
  styleUrls: ['./physical-verification.component.css']
})
export class PhysicalVerificationComponent implements OnInit {
  allLocationData:any [] = [];
  searchForm: FormGroup;
  isLoading = false;
  toHighlight: string = '';
  constructor(
    private route: ActivatedRoute,
		private router: Router,
		private fbuild: FormBuilder,
		private common: CommonAPIService,
		private erpCommonService: ErpCommonService
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.searchForm = this.fbuild.group({
			searchId: '',
			item_location: ''                
		});

  }

  getFilterLocation(event) {
		var inputJson = { 'filter': event.target.value };
		if (event.target.value && event.target.value.length > 2) {
      this.toHighlight = event.target.value
      this.isLoading = true;
			this.erpCommonService.getFilterLocation(inputJson).subscribe((result: any) => {
				this.allLocationData = [];
				if (result) {
          this.isLoading = false;
					for (var i = 0; i < result.length; i++) {
						this.allLocationData.push(result[i]);
					}
				}
			});
		} else {
      this.allLocationData = [];
    }
  }
  
  setLocationId(locationDetails, i) {
		this.searchForm.patchValue({
			item_location: locationDetails.location_name,
		});
	}

}


