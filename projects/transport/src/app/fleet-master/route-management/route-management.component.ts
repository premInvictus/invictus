import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService, TransportService } from '../../_services';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Element } from './element.model';
import { CapitalizePipe } from '../../../../../examination/src/app/_pipes';
import { DatePipe } from '@angular/common';
import { e, t } from '@angular/core/src/render3';

@Component({
  selector: 'app-route-management',
  templateUrl: './route-management.component.html',
  styleUrls: ['./route-management.component.scss']
})

export class RouteManagementComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['route_no', 'route_name', 'tv_id', 'start_time', 'end_time', 'stoppages', 'status', 'modify'];
  displayedColumns2: string[] = [
    'counter',
    'stop_name',
    'distance_from_school',
    'transport_slab',
    'transport_latitude',
    'transport_longitude',
    'status',
    'action'
  ];
  @ViewChild(MatSort) sort: MatSort;
  // @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('deleteModal') deleteModal;
  routeManagementForm: FormGroup;
  transportStopagges: FormGroup;
  currentUser: any;
  session: any;
  disableApiCall = false;
  ckeConfig: any = {};
  routemanagementArray: any[] = [];
  stoppageRoutesData: any[] = [];
  slabsData: any[] = [];
  TRANSPORT_STOPPAGE_ELEMENT_DATA: any[] = [];
  stoppageStatus = '0';
  current_stop_id = 0;
  currentIndex = 0;
  selectedSlabData: any[] = [];
  TRANSPORT_ROUTE_ELEMENT_DATA: Element[] = [];
  UpdateFlag = false;
  viewOnly = true;
  param: any = {};
  stoppageDataSource = new MatTableDataSource<Element>(this.TRANSPORT_STOPPAGE_ELEMENT_DATA);
  subExamDataSource = new MatTableDataSource<Element>(this.TRANSPORT_ROUTE_ELEMENT_DATA);
  multipleFileArray: any[] = [];
  imageArray: any[] = [];
  finalDocumentArray: any[] = [];
  counter: any = 0;
  currentFileChangeEvent: any;
  currentImage: any;
  bus_arr = [];
  userDataArr = [];
  stoppage_arr = [];
  route_arr = [];
  route_no_arr = ['petrol', 'diesel', 'cng'];
  selected_options: any = [];
  selected_stoppage_arr: any = [];
  currentTab: any = 0;
  btnDisable = false;
  routeStoppageMappingArray: any;
  curr_user: any
  formGroupArray: any[] = [];
  curr_session: any
  stoppageSchedule: any[];
  constructor(
    public dialog: MatDialog,
    private fbuild: FormBuilder,
    private smartService: SmartService,
    public commonService: CommonAPIService,
    public axiomService: AxiomService,
    public sisService: SisService,
    public transportService: TransportService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.session = JSON.parse(localStorage.getItem('session'));
  }

  // For Stoppage Component
  ngAfterViewInit() {
    // this.stoppageDataSource.paginator = this.paginator;
    this.stoppageDataSource.sort = this.sort;
  }

  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.getRoutes();
    this.buildForm();
    this.getRouteManagement();
    this.getAllTransportVehicle();
    this.getUser();
    this.getStoppages();
    // this.getStoppages2();
    this.selected_stoppage_arr = [];
    this.curr_user = JSON.parse(localStorage.getItem("currentUser"));
    this.curr_session = JSON.parse(localStorage.getItem("session"));
    this.getAllRouteStoppageMapping();
  }
  buildForm() {
    this.routeManagementForm = this.fbuild.group({
      'rm_id': '',
      'date': '',
      'tv_id': '',
      'route_id': '',
      'route_no': '',
      'route_name': '',
      'start_time': '',
      'end_time': '',
      'stoppages': [],
      'status': '',
      'pick_time': '',
      'drop_time': ''
    });

    // For Stoppage Component
    this.prepareForm()
    this.getSlabs();
  }
  // delete dialog open modal function
  openDeleteModal(value) {
    this.param.rm_id = value;
    this.param.text = 'Delete';
    this.deleteModal.openModal(this.param);
  }
  resetForm() {
    this.routeManagementForm.patchValue({
      'rm_id': '',
      'date': '',
      'tv_id': '',
      'route_id': '',
      'route_no': '',
      'route_name': '',
      'start_time': '',
      'end_time': '',
      'stoppages': [],
      'status': '',
      'pick_time': '',
      'drop_time': ''
    });
    this.imageArray = [];
    this.UpdateFlag = false;
    this.viewOnly = true;
    this.selected_stoppage_arr = [];

    // For Stoppage Component
    this.btnDisable = false;
    this.stoppageStatus = '0';
    this.prepareForm()
  }


  getRouteStoppages(event, item) {
    // console.log("event route stoppage array >>>>>>", event);
    let routeStoppageArray: any[] = [];
    // this.formGroupArray = [];
    routeStoppageArray = event.source.value;
    // this.setFormValue(item);
    let stoppage: any = this.getStoppage(routeStoppageArray);
    // console.log(">>>>>", stoppage.tsp_id);
    // console.log(">>>>>", routeStoppageArray);
    if (this.routeManagementForm.get('route_id').value) {
      const selectedRoute = this.route_arr.find(e => e.tr_id == this.routeManagementForm.get('route_id').value);
      item.tr_id = selectedRoute.tr_id;
    } else {
      item.tr_id = 0;
    }
    if(this.formGroupArray.length > 0 && this.routeManagementForm.get('route_id').value !== this.formGroupArray[0].tr_id){
      this.formGroupArray = [];
    }
    // console.log(">>>>>", item);
    // if (this.stoppageSchedule.length === 0) {
    // for (const titem of routeStoppageArray) {
    const findex = this.formGroupArray.findIndex(f => Number(f.tsp_id) === Number(routeStoppageArray));
    console.log(">>>>> event.source._selected", event.source._selected);
    if (event.isUserInput && !event.source._selected) {
      if (findex !== -1) {
        // console.log(">>>>> findex", findex);
        this.formGroupArray.splice(findex);
      }
    } else if (event.source._selected) {
      // console.log(">>>>>", findex);
      if (findex === -1) {
        this.formGroupArray.push({
          tsp_id: stoppage.tsp_id,
          tr_id: item.tr_id,
          tsp_name: stoppage.tsp_name,
          formGroup: this.fbuild.group({
            'tsp_drop_time': '',
            'tsp_pick_time': ''
          })
        });
      }

      let foundItem;
      this.formGroupArray.forEach((el) => {

        foundItem = this.routeStoppageMappingArray.find((e) => (el.tr_id == e.tr_id && el.tsp_id == e.tsp_id));
        if (foundItem) {
          el.tsp_pick_time = foundItem.tsp_pick_time;
          el.tsp_drop_time = foundItem.tsp_drop_time;

          el.formGroup.patchValue({
            "tsp_pick_time": el.tsp_pick_time,
            "tsp_drop_time": el.tsp_drop_time
          })
        }
      });
      // console.log(">>>>>>>>>>>>>>>>fga", this.formGroupArray);

    }
    // }
    // } 
    // else {
    //   for (const item of this.stoppageSchedule) {
    //     for (const titem of routeStoppageArray) {
    //       const findex = this.formGroupArray.findIndex(f => Number(f.se_id) === Number(titem));
    //       const findex2 = this.stoppageSchedule.findIndex(f => Number(f.se_id) === Number(titem));
    //       if (findex === -1 && Number(titem) === Number(item.se_id)
    //         && findex2 !== -1) {
    //         this.formGroupArray.push({
    //           tsp_id: titem,
    //           tsp_name: item.tsp_name,
    //           formGroup: this.fbuild.group({
    //             'tsp_drop_time': item.tsp_drop_time,
    //             'tsp_pick_time': ''
    //           })
    //         });
    //       }
    //       if (findex === -1 && findex2 === -1) {
    //         this.formGroupArray.push({
    //           tsp_id: titem,
    //           tsp_name: item.tsp_name,
    //           formGroup: this.fbuild.group({
    //             'tsp_drop_time': '',
    //             'tsp_pick_time': ''
    //           })
    //         });
    //       }
    //     }
    //   }
    // }
    console.log("fgA >>>>>>>>>>>>>>>>>.", this.formGroupArray);

  }
  getStoppage(stoppageId) {
    console.log("get a stoppage >>>>>>>>>>>>", stoppageId);
    const stoppage = this.stoppage_arr.find(element => element.tsp_id == stoppageId);
    return stoppage;
  }


  // setFormValue(value) {
  //   this.stoppageSchedule = [];
  //   const stoppagePickAndDrop: any = [];
  //   this.formGroupArray = [];
  //   if (value.tsp_pick_time) {
  //     for (const item of value.tsp_pick_time) {
  //       this.formGroupArray.push({
  //         se_id: item.se_id,
  //         sexam_name: item.tsp_name,
  //         formGroup: this.fbuild.group({
  //           'tsp_drop_time': '',
  //           'tsp_pick_time': ''
  //         })
  //       });
  //       stoppagePickAndDrop.push(item.tsp_id);
  //     }
  //     this.stoppageSchedule = value.tsp_pick_time;
  //   }
  // }

  submit() {
    if (this.routeManagementForm.valid) {
      this.disableApiCall = true;
      const inputJson = JSON.parse(JSON.stringify(this.routeManagementForm.value));
      inputJson.status = '1';
      inputJson.created_by = { login_id: this.currentUser.login_id, full_name: this.currentUser.full_name };
      const selectedRoute = this.route_arr.find(e => e.tr_id == this.routeManagementForm.value.route_id);
      if (selectedRoute) {
        inputJson.route_no = selectedRoute.tr_route_no;
        inputJson.route_name = selectedRoute.tr_route_name;
      }
      console.log("fga >>>> submit", this.formGroupArray);

      // this.transportService.insertRouteManagement(inputJson).subscribe((result_i: any) => {
      //   if (result_i) {
      //     this.getRouteManagement();
      //     this.resetForm();
      //     this.disableApiCall = false;
      //     this.commonService.showSuccessErrorMessage('Route Added Successfully', 'success');
      //   } else {
      //     this.commonService.showSuccessErrorMessage('Insert failed', 'error');
      //     this.disableApiCall = false;
      //   }
      // });
    } else {
      this.commonService.showSuccessErrorMessage('Please fill required fields', 'error');
    }
  }
  getAllTransportVehicle() {
    this.bus_arr = [];
    this.transportService.getAllTransportVehicle({ status: '1' }).subscribe((result: any) => {
      if (result && result.length > 0) {
        this.bus_arr = result;
      }
    });
  }
  getUser() {
    this.userDataArr = [];
    const inputJson: any = {};
    inputJson['role_id'] = '2';
    inputJson['status'] = '1';
    this.sisService.getUser(inputJson).subscribe((result: any) => {
      if (result && result.data && result.data[0]['au_login_id']) {
        this.userDataArr = result.data;
      }
    });
  }
  getRoutes() {
    this.route_arr = [];
    this.transportService.getRoutes({}).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.route_arr = result.data;
      }
    });
  }
  getStoppagesPerRoute(route_id) {
    this.stoppage_arr = [];
    this.transportService.getStoppagesPerRoute({ tr_id: route_id }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.stoppage_arr = result.data;
        console.log("stoppage array >>>>", this.stoppage_arr);

      }
    });
  }
  getStoppages() {
    this.stoppage_arr = [];
    this.transportService.getStoppages({ tsp_status: '1' }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.stoppage_arr = result.data;
        console.log("stoppage array >>>>", this.stoppage_arr);
      }
    });
  }
  getRouteManagement() {
    this.TRANSPORT_ROUTE_ELEMENT_DATA = [];
    this.subExamDataSource = new MatTableDataSource<Element>(this.TRANSPORT_ROUTE_ELEMENT_DATA);

    let pick_time: any, drop_time: any, stoppages_list = []

    // TODO call the transport route stoppage mapping---- 'get all' or 'get' api here
    // TODO GET the trs_id from here
    /**
      * @api
      * @route GET getAll - http://dev-api-transport.invictusprojects.in/route-stoppage-mapping/getAll
     */

    const getAllPayload = {
      "status": '1',
      "ses_id": '5'
    }

    this.transportService.getAllRouteStoppageMapping(getAllPayload).subscribe((result: any) => {
      if (result) {
        this.routeStoppageMappingArray = result.data
        console.log('>>>>>>>> Result data : ', result.data);

        this.transportService.getAllRouteManagement({}).subscribe((result: any) => {
          if (result && result.length > 0) {
            this.routemanagementArray = result;
            console.log('>>>>>>> Result data for RouteManagementArray : ', this.routemanagementArray)
            for (const item of this.routemanagementArray) {
              console.log('>>>>>item', item);
              console.log('>>>>> this.route_arr', this.stoppage_arr);
    
    
              // for (const item2 of this.routeStoppageMappingArray) {
                // console.log('>>>>> stoppages', item.stoppages_det);
                // console.log('>>>>> trsm', trsm);
    
              //   let stoppages_details_arr = item.stoppages_det
    
              //   stoppages_details_arr.forEach(e => {
                //   if(item.route_id == item2.tr_id && e.tsp_id == item2.tsp_id){
                    
                //     pick_time = trsm.tsp_pick_time ? trsm.tsp_pick_time : '-'
                //     drop_time = trsm.tsp_drop_time ? trsm.tsp_drop_time : '-'
                //   }
                // else{
                //     pick_time = "-";
                //     drop_time = "-";
                //   }              
              //   })
    
    
              //   // stoppages_list = item.stoppages_det.map((e: any) => (e.tsp_name)).join(' ( ' + item2.tsp_pick_time ? item2.tsp_pick_time : '-' + ' : ' + item2.tsp_drop_time ? item2.tsp_drop_time : '-' + ' ),')
              // }
    
              // *Stoppages List creation [ Original ]
              // const trsm = this.routeStoppageMappingArray.find(e => e.route_id == item.tr_id);
              if (item.stoppages_det) {
                stoppages_list = item.stoppages_det.map((e: any) => (e.tsp_name)).join(' ( ' + pick_time + ' : ' + drop_time + ' ), ')
              //   // stoppages_list = item.stoppages_det.map((e: any) => {
              //   //   if(e.tsp_name)
              //   // })
              //   item.stoppages_det.forEach((el)=> {
              //     if(el.tsp_id == trsm.tsp_id){
              //       stoppages_list = item.stoppages_det.map((e: any) => (e.tsp_name)).join(' ( ' + trsm.tsp_pick_time + ' : ' + trsm.tsp_drop_time + ' ), ')
              //     }
              //   })
              }
    
    
              this.TRANSPORT_ROUTE_ELEMENT_DATA.push({
                rm_id: item.rm_id,
                tv_id: item.transport_vehicle.bus_number,
                route_id: item.route_id,
                route_no: item.route_no,
                route_name: item.route_name,
                start_time: item.start_time,
                end_time: item.end_time,
                stoppages: stoppages_list,
                status: item.status,
                modify: item.rm_id,
                action: item,
              });
            }
            this.subExamDataSource = new MatTableDataSource<Element>(this.TRANSPORT_ROUTE_ELEMENT_DATA);
          }
        });
      }
    })
  }
  getActiveStatus(value: any) {
    if (value.status === '1') {
      return true;
    }
  }
  toggleStatus(value: any) {
    if (value.status === '1') {
      value.status = '0';
    } else {
      value.status = '1';
    }
    this.transportService.updateRouteManagement(value).subscribe((result: any) => {
      if (result.status === 'ok') {
        this.commonService.showSuccessErrorMessage('Status Changed', 'success');
        this.getRouteManagement();
      }
    });
  }
  formEdit(value: any) {
    this.UpdateFlag = true;
    this.viewOnly = false;
    this.routeManagementForm.patchValue({
      rm_id: value.rm_id,
      tv_id: value.tv_id,
      route_id: value.route_id.toString(),
      route_no: value.route_no,
      route_name: value.route_name,
      start_time: value.start_time,
      end_time: value.end_time,
      stoppages: value.stoppages,
      status: value.status,
    });
    // console.log("edit control >>>>>", value);
    let foundItem;
    this.formGroupArray.forEach((el) => {
      foundItem = this.routeStoppageMappingArray.find((e) => (el.tr_id == e.tr_id && el.tsp_id == e.tsp_id));
      if (foundItem) {
        el.tsp_pick_time = foundItem.tsp_pick_time;
        el.tsp_drop_time = foundItem.tsp_drop_time;
      }
    });
    // this.setFormValue(value);
    // this.getStoppagesPerRoute(value.route_id);
  }

  getAllRouteStoppageMapping() {
    const getAllPayload = {
      "status": '1',
      "ses_id": '5'
    }
    this.transportService.getAllRouteStoppageMapping(getAllPayload).subscribe((result: any) => {
      if (result) {
        this.routeStoppageMappingArray = result.data;
      }
    });
  }

  updateRM(item) {

    console.log("fga update >>>>>>>>>>>>>>>>>>>>>>>>>", this.formGroupArray);
    let presentRouteStoppage;
    let updateJson = []
    let insertJson = []
    const getAllPayload = {
      "status": '1',
      "ses_id": '5'
    }
    this.transportService.getAllRouteStoppageMapping(getAllPayload).subscribe((result: any) => {
      if (result) {
        this.routeStoppageMappingArray = result.data;
        this.formGroupArray.forEach((e) => {
          presentRouteStoppage = this.routeStoppageMappingArray.find(el => (el.tr_id == e.tr_id && el.tsp_id == e.tsp_id));
          if (presentRouteStoppage) {
            updateJson.push({
              status: '1',
              tr_id: e.tr_id,
              tsp_id: e.tsp_id,
              tsp_pick_time: e.formGroup.value.tsp_pick_time,
              tsp_drop_time: e.formGroup.value.tsp_drop_time,
              created_by: {
                login_id: this.curr_user.login_id,
                full_name: this.curr_user.full_name
              },
              trs_id: presentRouteStoppage.trs_id,
              ses_id: Number(this.curr_session.ses_id)
            });
          } else {
            insertJson.push({
              status: '1',
              tr_id: e.tr_id,
              tsp_id: e.tsp_id,
              tsp_pick_time: e.formGroup.value.tsp_pick_time,
              tsp_drop_time: e.formGroup.value.tsp_drop_time,
              created_by: {
                login_id: this.curr_user.login_id,
                full_name: this.curr_user.full_name
              },
              ses_id: Number(this.curr_session.ses_id)
            })
          }
        });
        if (updateJson) {
          this.transportService.updateRouteStoppageMapping(updateJson).subscribe((result: any) => {
            if (result) {
              this.commonService.showSuccessErrorMessage('Stoppage Mapping Updated Successful', 'success')
            } else {
              this.commonService.showSuccessErrorMessage('Stoppage Mapping Update Unsuccessful', 'error')
            }
          });
        }
        if (insertJson) {
          this.transportService.insertRouteStoppageMapping(insertJson).subscribe((result: any) => {
            if (result) {
              this.commonService.showSuccessErrorMessage('Stoppage Mapping Updated Successful', 'success')
            } else {
              this.commonService.showSuccessErrorMessage('Stoppage Mapping Update Unsuccessful', 'error')
            }
          });
        }
      } else {
        this.commonService.showSuccessErrorMessage('Stoppage Mapping Update Unsuccessful', 'error')
      }
    });
    console.log("update json >>>>>>>>>>>>", updateJson);
    console.log("insert Json >>>>>>>>>>>>", insertJson);

    // const getAllPayload = {
    //   "status": '1',
    //   "ses_id": '5'
    // }
    // let updateJson = []
    // let insertJson = []

    // this.transportService.getAllRouteStoppageMapping(getAllPayload).subscribe((result: any) => {
    //   if (result) {
    //     this.routeStoppageMappingArray = result.data
    //     // console.log('>>>>>>>> Result data : ', result.data);
    //     let presentRouteStoppage: any = 0;
    //     // console.log("route stoppage mapping all >>>>", this.routeStoppageMappingArray);    
    //     if (this.routeManagementForm.valid) {
    //       let tr_id: any
    //       const selectedRoute = this.route_arr.find(e => e.tr_id == this.routeManagementForm.get('route_id').value);
    //       // console.log("selected route array", this.selected_stoppage_arr);
    //       // console.log("route stoppage array", this.routemanagementArray);
    //       this.selected_stoppage_arr.forEach(element => {
    //         // this.routeStoppageMappingArray.forEach(e => {
    //         //   if(element.tsp_id)
    //         // });            
    //         presentRouteStoppage = this.routeStoppageMappingArray.find(e => (e.tr_id == element.tr_id && e.tsp_id == element.tsp_id));
    //         // this.routeStoppageMappingArray.forEach(element => {
    //         // });
    //         // console.log("present >>>", element);

    //         if (presentRouteStoppage && presentRouteStoppage.trs_id) {
    //           updateJson.push({
    //             status: '1',
    //             tr_id: presentRouteStoppage.tr_id,
    //             tsp_id: presentRouteStoppage.tsp_id,
    //             tsp_pick_time: element.tsp_pick_time,
    //             tsp_drop_time: element.tsp_drop_time,
    //             created_by: {
    //               login_id: this.curr_user.login_id,
    //               full_name: this.curr_user.full_name
    //             },
    //             trs_id: presentRouteStoppage.trs_id,
    //             ses_id: Number(this.curr_session.ses_id)
    //           });
    //         } else {
    //           insertJson.push({
    //             status: '1',
    //             tr_id: element.tr_id,
    //             tsp_id: element.tsp_id,
    //             tsp_pick_time: element.tsp_pick_time,
    //             tsp_drop_time: element.tsp_drop_time,
    //             created_by: {
    //               login_id: this.curr_user.login_id,
    //               full_name: this.curr_user.full_name
    //             },
    //             ses_id: Number(this.curr_session.ses_id)
    //           });
    //         }
    //       });

    //     }
    //     console.log("update array", updateJson);
    //     console.log("insert array", insertJson);

    //   } else {
    //     this.commonService.showSuccessErrorMessage('Stoppage Mapping Update Unsuccessful', 'error')
    //   }
    // })
  }



  updateRouteManagement(item) {
    if (this.routeManagementForm.valid) {
      let tr_id: any
      const inputJson = JSON.parse(JSON.stringify(this.routeManagementForm.value));
      const selectedRoute = this.route_arr.find(e => e.tr_id == this.routeManagementForm.value.route_id);
      if (selectedRoute) {
        inputJson.route_no = selectedRoute.tr_route_no;
        inputJson.route_name = selectedRoute.tr_route_name;
        inputJson.route_id = selectedRoute.tr_id
      }

      this.transportService.updateRouteManagement(inputJson).subscribe((result: any) => {
        if (result) {
          // TODO UPDATE ----- transport route stoppage mapping [TRS] based on trs_id
          this.commonService.showSuccessErrorMessage('Updated Succesfully', 'success');
          this.updateRM(item);
          this.getRouteManagement();
          this.resetForm();
        }
      });

    } else {
      this.commonService.showSuccessErrorMessage('Please fill required fields', 'error');
    }

  }

  updateRouteStoppageMapping() {
    /**
     * @payload 
     * {
        "status": "1", //  Default val = 1
        "ts_id": "1",  // route id 
        "tsp_id": "1", // stoppage id
        "tsp_pick_time": "07:30:00", // pick time
        "tsp_drop_time": "15:10:00", // drop time
        "created_by": {
            "login_id": "2648", // currentUser
            "full_name": "Admin" // currentUser
        },
        "trs_id": 1, // refrence id for transport route stoppage mapping
        "ses_id": 5  // current session
      }
    */

    let inputJson = []

    this.selected_stoppage_arr.forEach(element => (
      // console.log('>>>>>>>>>>>>>>>>>>>', element),

      inputJson.push({
        status: '1',
        ts_id: element.ts_id,
        tsp_id: element.tsp_id,
        tsp_pick_time: element.tsp_pick_time,
        tsp_drop_time: element.tsp_drop_time,
        created_by: {
          login_id: this.curr_user.login_id,
          full_name: this.curr_user.full_name
        },
        trs_id: element.trs_id,
        ses_id: Number(this.curr_session.ses_id)
      }))
    )

    this.transportService.updateRouteStoppageMapping(inputJson).subscribe((result: any) => {
      if (result) {
        this.commonService.showSuccessErrorMessage('Stoppage Mapping Updated Successfully', 'success')
      } else {
        this.commonService.showSuccessErrorMessage('Stoppage Mapping Update Unsuccessfull', 'error')
      }
    })
  }

  deleteTransportLogs($event) {
    const deleteJson = {
      rm_id: $event.rm_id,
      status: '5'
    };
    this.transportService.updateRouteManagement(deleteJson).subscribe((result: any) => {
      if (result) {
        this.commonService.showSuccessErrorMessage('Deleted Succesfully', 'success');
        this.getRouteManagement();
        this.resetForm();
      }
    });
  }

  changeTab(event) {
    this.currentTab = event.index;
  }

  prepareStoppageData(event, item) {
    if (event.source._selected) {
      const inputJson = this.routeManagementForm;
      if (this.routeManagementForm.get('route_id').value) {
        const selectedRoute = this.route_arr.find(e => e.tr_id == this.routeManagementForm.get('route_id').value);
        item.tr_id = selectedRoute.tr_id;
      } else {
        item.tr_id = 0;
      }
      this.selected_stoppage_arr.push(item)
    } else {
      const index = this.selected_stoppage_arr.findIndex(ele => ele.tsp_id === item.tsp_id)
      this.selected_stoppage_arr.splice(index, 1)
    }
  }

  updateTime(event: any, item: any) {
    /**
     * @payload
     * {
        "tsp_id": "315",
        "tsp_name": "Baidyanath Talkies",
        "tsp_distance": "10",
        "tsp_status": "1",
        "tsp_sess_id": "5",
        "tsp_slab_id": "41",
        "tsp_created_by": "2648",
        "tsp_created_at": "2021-05-29 05:28:38",
        "tsp_latitude": null,
        "tsp_longitude": null,
        "tsp_pick_time": "08:00",
        "tsp_drop_time": "16:00",
        "ts_name": "Slab-1",
        "ts_id": "41",
        "ts_ft_id": "2",
        "ts_fm_id": "[\"04\",\"05\",\"07\",\"08\",\"09\",\"10\",\"11\",\"12\",\"01\",\"02\",\"03\"]",
        "ts_calm_id": "2",
        "ts_cost": "650",
        "ts_status": "1"
      }
     */
    this.selected_stoppage_arr.forEach(element => {
      if (element.tsp_id == item.tsp_id) {
        if (event.target.id == 'pick_time') {
          element.tsp_pick_time = event.target.value;
        } else {
          element.tsp_drop_time = event.target.value;
        }
      }
    });
    console.log(this.selected_stoppage_arr)
  }

  /**
   * STOPPAGE CODE
   */
  prepareForm() {
    this.transportStopagges = this.fbuild.group({
      transport_stop_name: '',
      transport_distance_from_school: '',
      transport_slab: '',
      transport_longitude: '',
      transport_latitude: ''
    });
  }

  getSlabs() {
    this.slabsData = [];
    this.transportService.getSlabs({ ts_status: '1' }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.slabsData = result.data;
      } else {
        this.slabsData = [];
      }
    }, (error) => {
      this.slabsData = [];
    });
  }

  prepareDataSource() {
    this.stoppageDataSource = new MatTableDataSource<Element>(this.TRANSPORT_STOPPAGE_ELEMENT_DATA);
    let counter = 1;
    for (let i = 0; i < this.stoppageRoutesData.length; i++) {
      const tempObj = {};
      if (this.stoppageRoutesData[i]['ts_id'] !== null) {
        tempObj['counter'] = counter;
        tempObj['tsp_id'] = this.stoppageRoutesData[i]['tsp_id'];
        tempObj['stop_name'] = this.stoppageRoutesData[i]['tsp_name'];
        tempObj['distance_from_school'] = this.stoppageRoutesData[i]['tsp_distance'];
        tempObj['transport_slab'] = this.stoppageRoutesData[i]['ts_name'];
        tempObj['status'] = this.stoppageRoutesData[i]['tsp_status'];
        tempObj['transport_latitude'] = this.stoppageRoutesData[i]['tsp_latitude'],
          tempObj['transport_longitude'] = this.stoppageRoutesData[i]['tsp_longitude']
        this.TRANSPORT_STOPPAGE_ELEMENT_DATA.push(tempObj);
        counter++;
      }
    }
    this.stoppageDataSource = new MatTableDataSource(this.TRANSPORT_STOPPAGE_ELEMENT_DATA);
    this.stoppageDataSource.sort = this.sort;
    // this.stoppageDataSource.paginator = this.paginator;
    // this.sort.sortChange.subscribe((() => this.paginator.pageIndex = 0));
  }

  patchFormValues() {
    const formData = this.stoppageRoutesData[this.currentIndex];
    this.transportStopagges.patchValue({
      transport_stop_name: formData && formData['tsp_name'] ? formData['tsp_name'] : '',
      transport_distance_from_school: formData && formData['tsp_distance'] ? formData['tsp_distance'] : '',
      transport_slab: formData && formData['tsp_slab_id'] ? formData['tsp_slab_id'] : '',
      transport_latitude: formData && formData['tsp_latitude'] ? formData['tsp_latitude'] : '',
      transport_longitude: formData && formData['tsp_longitude'] ? formData['tsp_longitude'] : ''
    });
  }

  getStoppages2() {
    this.stoppageRoutesData = [];
    this.TRANSPORT_STOPPAGE_ELEMENT_DATA = [];
    this.stoppageDataSource = new MatTableDataSource(this.TRANSPORT_STOPPAGE_ELEMENT_DATA);
    this.transportService.getStoppages({}).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.stoppageRoutesData = result.data;
        this.prepareDataSource();
      } else {
        this.TRANSPORT_STOPPAGE_ELEMENT_DATA = [];
        this.stoppageDataSource = new MatTableDataSource(this.TRANSPORT_STOPPAGE_ELEMENT_DATA);
      }
    }, (error) => {
      this.TRANSPORT_STOPPAGE_ELEMENT_DATA = [];
      this.stoppageDataSource = new MatTableDataSource(this.TRANSPORT_STOPPAGE_ELEMENT_DATA);
    });
  }

  callSaveAPI(inputJson) {
    this.transportService.saveStoppage(inputJson).subscribe((result: any) => {
      this.btnDisable = false;
      if (result.status === 'ok') {
        this.commonService.showSuccessErrorMessage(result.message, 'success');
        this.resetForm();
        this.stoppageStatus = '';
        this.current_stop_id = 0;
        this.getStoppages2();
      } else {
        this.commonService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }

  saveForm() {
    const slabArr = [];
    if (this.transportStopagges.valid) {
      this.btnDisable = true;
      let inputJson = {};
      inputJson = {
        tsp_name: this.transportStopagges.value.transport_stop_name,
        tsp_distance: this.transportStopagges.value.transport_distance_from_school,
        tsp_slab_id: this.transportStopagges.value.transport_slab,
        tsp_status: '1',
        tsp_latitude: this.transportStopagges.value.transport_latitude,
        tsp_longitude: this.transportStopagges.value.transport_longitude
      };
      if (this.current_stop_id) {
        inputJson['tsp_id'] = this.current_stop_id;
        inputJson['tsp_status'] = this.stoppageStatus;
      }
      this.callSaveAPI(inputJson);
    } else {
      this.btnDisable = false;
      this.commonService.showSuccessErrorMessage('Please Fill Required Fields', 'error');
    }
  }

  editStoppage(element) {
    this.stoppageStatus = element.status;
    this.current_stop_id = element.tsp_id;
    this.currentIndex = parseInt(element.counter, 10) - 1;
    this.patchFormValues();
  }

  deleteStoppage(element) {
    this.stoppageStatus = '5';
    this.current_stop_id = element.tsp_id;
    this.deleteModal.openModal(element);
  }
  changeStatus(element, event) {
    const inputJson = {};
    if (event.checked) {
      this.stoppageStatus = '1';
    } else {
      this.stoppageStatus = '0';
    }
    this.current_stop_id = element.tsp_id;
    inputJson['tsp_id'] = this.current_stop_id;
    inputJson['tsp_status'] = this.stoppageStatus;
    inputJson['statusUpdate'] = true;
    this.callSaveAPI(inputJson);
  }
  deleteConfirm(event) {
    const inputJson = {};
    inputJson['tsp_id'] = this.current_stop_id;
    inputJson['tsp_status'] = this.stoppageStatus;
    this.callSaveAPI(inputJson);
  }
  applyFilter(filterValue: string) {
    this.stoppageDataSource.filter = filterValue.trim().toLowerCase();
  }
}
