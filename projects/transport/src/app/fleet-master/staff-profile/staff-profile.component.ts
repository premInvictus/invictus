import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AxiomService, SisService, SmartService, CommonAPIService,TransportService } from '../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Element } from './element.model';
import { AddTransportStaffComponent } from '../add-transport-staff/add-transport-staff.component';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-staff-profile',
  templateUrl: './staff-profile.component.html',
  styleUrls: ['./staff-profile.component.scss']
})
export class StaffProfileComponent implements OnInit {

  tableDivFlag = false;
  ELEMENT_DATA: Element[];
  displayedColumns: string[] = ['au_full_name', 'au_mobile', 'whatsapp_no', 'au_dob','valid_upto',
  'au_email','batch_licence_no','driver_id','licence_type','licence_no','action'];
  dataSource = new MatTableDataSource<Element>();
  constructor(
    private fbuild: FormBuilder,
    private transportService: TransportService,
    private sisService: SisService,
    private smartService: SmartService,
    private commonAPIService: CommonAPIService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getAllTransportStaff();
  }
  openDialog(action,data=null): void {
    let title = 'Add Staff Details';
    if(action=='edit'){
      title = 'Edit Staff Details'
    } else if(action=='view'){
      title = 'Staff Details'
    }
    const dialogRef = this.dialog.open(AddTransportStaffComponent, {
      width: '80%',
      height: '80%',
      data: {title:title, action:action, data:data}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result && result.status) {
        this.getAllTransportStaff();
      }
    });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getAllTransportStaff(){
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    this.transportService.getAllTransportStaff({}).subscribe((result: any) => {
      if(result && result.length > 0) {
        const temp = result;
        temp.forEach(element => {
          const tempelement:any = {};
          tempelement.au_profileimage=element.users_det.au_profileimage;
          tempelement.au_full_name=element.users_det.au_full_name;
          tempelement.au_mobile=element.users_det.au_mobile;
          tempelement.au_email=element.users_det.au_email;
          tempelement.au_dob=element.users_det.au_dob;

          tempelement.ts_au_login_id=element.users_det.ts_au_login_id;
          tempelement.p_address=element.p_address;
          tempelement.whatsapp_no=element.whatsapp_no;
          tempelement.batch_licence_no=element.batch_licence_no;
          tempelement.driver_id=element.driver_id;
          tempelement.licence_type=element.licence_type;
          tempelement.licence_no=element.licence_no;
          tempelement.valid_upto=element.valid_upto;
          tempelement.status=element.status;  
          tempelement.action = element;   
          this.ELEMENT_DATA.push(tempelement) ;    
        });
        this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
        this.tableDivFlag = true;
      }
    })

  }

}
