import { Component, OnInit } from '@angular/core';
import { ErpCommonService } from 'src/app/_services';
import { MatDialog } from '@angular/material/dialog';
import { AdvancedSearchModalComponent } from '../../../library-shared/advanced-search-modal/advanced-search-modal.component';


@Component({
  selector: 'app-school-dashboard',
  templateUrl: './school-dashboard.component.html',
  styleUrls: ['./school-dashboard.component.css']
})
export class SchoolDashboardComponent implements OnInit {
  bookDetailsArray: any[] = [];
  result: any = {};
  constructor(private common: ErpCommonService, public dialog: MatDialog) { }
  ngOnInit() {
  }
  openAdvanceSearchDialog(): void {
    const dialogRef = this.dialog.open(AdvancedSearchModalComponent, {
      width: '750px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


}