import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { TransportService } from '../../_services';

@Component({
  selector: 'app-device-mapping',
  templateUrl: './device-mapping.component.html',
  styleUrls: ['./device-mapping.component.scss']
})
export class DeviceMappingComponent implements OnInit {

  isLoading : boolean = true;
  loader_status = "Feature Under Construction";
  vehicleDetails: any;
  tableDivFlag = false;
  ELEMENT_DATA: Element[];
  displayedColumns: string[] = ['bus_number', 'bus_details', 'registration_no', 'device_no','action'];
  dataSource = new MatTableDataSource<Element>();
  constructor(
    private transportService: TransportService,
    ) { }

  ngOnInit() {
    this.getAllTransportVehicle();
  }

  openDialog(type){
    alert("feature is under development")
  }

  
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  getAllTransportVehicle(){
    this.loader_status = "Loading Vehicles";
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    this.transportService.getAllTransportVehicle({}).subscribe((result: any) => {
      if(result && result.length > 0) {
        this.isLoading = false;
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
          tempelement.driver_id = element.driver.user_det ? element.driver.user_det.au_full_name:'',
          tempelement.conductor_id = element.conductor.user_det ? element.conductor.user_det.au_full_name:'',
          tempelement.supervisor_id = element.supervisor.user_det ? element.supervisor.user_det.au_full_name:'',
          tempelement.action = element;   
          this.ELEMENT_DATA.push(tempelement) ;    
        });
        this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
        this.tableDivFlag = true;
      }
    })

  }
}
