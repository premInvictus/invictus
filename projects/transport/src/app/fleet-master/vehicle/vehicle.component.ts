import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AxiomService, SisService, SmartService, CommonAPIService,TransportService } from '../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Element } from './vehicle.model'
import { AddVehicleComponent } from '../add-vehicle/add-vehicle.component';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent implements OnInit {

  tableDivFlag = false;
  ELEMENT_DATA: Element[];
  displayedColumns: string[] = ['bus_number', 'bus_details', 'registration_no', 'registration_valid_upto','permit_valid_upto',
  'insurance_valid_upto','puc_valid_upto','insurance_provider','insurance_no','chasis_no','engine_no','device_no','action'];
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
    this.getAllTransportVehicle();
  }
  openDialog(action,data=null): void {
    let title = 'Add Vehicle';
    if(action=='edit'){
      title = 'Edit Vehicle'
    } else if(action=='view'){
      title = 'Vehicle Details'
    }
    const dialogRef = this.dialog.open(AddVehicleComponent, {
      width: '80%',
      height: '80%',
      data: {title:title, action:action, data:data}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result && result.status) {
        this.getAllTransportVehicle();
      }
    });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getAllTransportVehicle(){
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    this.transportService.getAllTransportVehicle({}).subscribe((result: any) => {
      if(result && result.length > 0) {
        const temp = result;
        temp.forEach(element => {
          const tempelement:any = {};
          tempelement.tv_id = element.tv_id ;
          tempelement.bus_number = element.bus_number ;
          tempelement.bus_details = element.bus_details ;
          tempelement.registration_no = element.registration_no ;
          tempelement.registration_valid_upto = element.registration_valid_upto ;
          tempelement.permit_valid_upto = element. permit_valid_upto;
          tempelement.insurance_valid_upto = element.insurance_valid_upto ;
          tempelement.puc_valid_upto = element.puc_valid_upto ;
          tempelement.insurance_provider = element.insurance_provider ;
          tempelement.bus_image = element.bus_image ;
          tempelement.insurance_no = element.insurance_no ;
          tempelement.chasis_no = element.chasis_no ;
          tempelement.engine_no = element.engine_no ;
          tempelement.device_no = element.device_no ;
          tempelement.documents = element.documents,
          tempelement.status = element.status ;
          tempelement.action = element;   
          this.ELEMENT_DATA.push(tempelement) ;    
        });
        this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
        this.tableDivFlag = true;
      }
    })

  }

}
