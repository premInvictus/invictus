import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
import { TitleCasePipe, DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { AddLocationDialog } from './add-location-dialog/add-location-dialog.component';
@Component({
  selector: 'app-location-search-and-add',
  templateUrl: './location-search-and-add.component.html',
  styleUrls: ['./location-search-and-add.component.css']
})
export class LocationSearchAndAddComponent implements OnInit {

  allLocationData:any [] = [];
  searchForm: FormGroup;
  isLoading = false;
  toHighlight: string = '';
  constructor(
    public dialog: MatDialog, 
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
  
  openAddLocationDialog(): void {
    const dialogRef = this.dialog.open(AddLocationDialog, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(result => {
      //this.getVendorList();

    });
  }

}
