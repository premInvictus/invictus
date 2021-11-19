import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AxiomService, SisService, SmartService, CommonAPIService, TransportService } from '../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Element } from './element.model';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { element } from '@angular/core/src/render3/instructions';
import { DatePipe } from '@angular/common';
import { PreviewDocumentComponent } from '../../transport-shared/preview-document/preview-document.component';


@Component({
  selector: 'app-bus-checklist',
  templateUrl: './bus-checklist.component.html',
  styleUrls: ['./bus-checklist.component.scss']
})
export class BusChecklistComponent implements OnInit {

  tableDivFlag = false;
  ELEMENT_DATA: Element[];
  displayedColumns: string[] = [ 'cl_name', 'cl_type','select','document'];
  dataSource = new MatTableDataSource<Element>();
  groupdataSource: any[] = [];
  bus_arr: any = [];
  type_arr: any = [{id:'startday',name:'start day'},{id:'endday',name:'end day'}];
  checklist_arr:any[] = [];
  transportstudent_arr: any = [];
  paramform: FormGroup;
  selection = new SelectionModel<Element>(true, []);
  stopages: any = [];
  vehiclecheclist_arr: any = [];
  currentUser:any;

  imageArray = [];
	viewOnly = false;
  documentsArray:any[] = [];
	currentFileChangeEvent: any;
	multipleFileArray: any[] = [];
  counter: any = 0;
  currentImage: any;

  constructor(
    private fbuild: FormBuilder,
    private transportService: TransportService,
    private sisService: SisService,
    private smartService: SmartService,
    private commonAPIService: CommonAPIService,
    public dialog: MatDialog,
    public dialogRef2: MatDialogRef<PreviewDocumentComponent>,
  ) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // this.getAllTransportStaff();
    this.getAllTransportVehicle();
    // this.getAllChecklist();
    this.buildForm();
  }
  addCheckList(item){
    if(item){
      this.documentsArray.push({
        tv_id: item.tv_id, 
        checklist_type: item.checklist_type, 
        cl_id:item.cl_id,
        cl_status:item.cl_status,
        document:item.document
      })
    }
  }
  buildForm() {
    this.paramform = this.fbuild.group({
      date: '',
      checklist_type: ''
    })
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Element): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  groupBy(xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };
  createStopages(list) {
    const stopages: any[] = [];
    list.forEach(item => {
      if (stopages.findIndex(e => e.tsp_id == item.tsp_id) == -1) {
        stopages.push({ tsp_id: item.tsp_id, tsp_name: item.tsp_name })
      }
    })
    return stopages;
  }
  markChecklist(cl_status,item){
    console.log(cl_status,item);
    const findex = this.documentsArray.findIndex(e => e.tv_id == item.tv_id && e.checklist_type == this.paramform.value.checklist_type && e.cl_id == item.cl_id);
    if(findex != -1){
      this.documentsArray[findex].cl_status = cl_status 
    }
    console.log('this.documentsArray',this.documentsArray);
  }
  checkedChecklist(cl_status,item){
    const findex = this.documentsArray.findIndex(e => e.tv_id == item.tv_id && e.checklist_type == this.paramform.value.checklist_type && e.cl_id == item.cl_id && e.cl_status == cl_status);
    if(findex != -1){
      return true;
    } else {
      return false
    }
  }
  async getAllVehicleChecklist() {
    console.log('this.paramform.valid',this.paramform.valid);
    if (this.paramform.valid) {
      this.selection.clear();
      this.groupdataSource = [];
      this.checklist_arr = [];
      this.vehiclecheclist_arr = [];
      this.documentsArray = [];
      
      const param1: any = {};
      param1.checklist_type = this.paramform.value.checklist_type;
      param1.date = new DatePipe('en-in').transform(this.paramform.value.date, 'yyyy-MM-dd');
      await this.transportService.getAllVehicleChecklist(param1).toPromise().then((result: any) => {
        if (result && result.length > 0) {
          this.vehiclecheclist_arr = result;
        }
      });
      const param: any = {};
      param.status = '1';
      this.transportService.getAllChecklist(param).subscribe((result: any) => {
        if (result && result.length > 0) {
          this.checklist_arr = result;
          // console.log('bus_arr',this.bus_arr);
          this.bus_arr.forEach(bus => {
            this.ELEMENT_DATA = [];
            this.checklist_arr.forEach((element, index) => {
              const busdet = this.vehiclecheclist_arr.find(e => e.tv_id == bus.tv_id);
              let novcdet = true;
              if(busdet){
                bus['vc_id'] = busdet.vc_id;
                if(busdet.fit_status){
                  console.log('busdet.fit_status',busdet.fit_status)
                  this.selection.select(busdet.tv_id);
                } 
                        
                const vcdet = busdet.checklist.find(e => e.cl_id == element.cl_id);
                if(vcdet){
                  this.addCheckList({
                    tv_id: busdet.tv_id, 
                    checklist_type: busdet.checklist_type, 
                    cl_id:vcdet.cl_id,
                    cl_status:vcdet.cl_status,
                    document:vcdet.document
                  })
                  novcdet = false;
                }
              }
              if(novcdet){
                this.addCheckList({
                  tv_id: bus.tv_id, checklist_type: this.paramform.value.checklist_type, cl_id:element.cl_id,cl_status:'',document:[]
                })
              }
              const tempelement: any = {};
              tempelement.position = index + 1;
              tempelement.tv_id = bus.tv_id;
              tempelement.cl_id = element.cl_id;
              tempelement.cl_name = element.cl_name;
              tempelement.cl_type = element.cl_type;
              tempelement.action = tempelement;
              this.ELEMENT_DATA.push(tempelement);
            });
            this.groupdataSource[bus.tv_id] = new MatTableDataSource<Element>(this.ELEMENT_DATA);
            console.log('this.groupdataSource',this.groupdataSource)
          });
          this.tableDivFlag = true;
          console.log('console.log(this.selection.selected)',this.selection.selected);       
        }
      });
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
  getAllChecklist() {
    this.checklist_arr = [];
    this.transportService.getAllChecklist({ status: '1' }).subscribe((result: any) => {
      if (result && result.length > 0) {
        this.checklist_arr = result;
      }
    });
  }
  submit(item) {
    console.log('item',item);
    if (this.paramform.valid) {
      if (item) {
        const checklist:any[] = [];
        this.documentsArray.forEach(e => {
          if(e.tv_id == item.tv_id){
            checklist.push({
              cl_id:e.cl_id,
              cl_status:e.cl_status,
              document:e.document
            })
          }
        })
        const insertdata: any = {};
        insertdata.tv_id = item.tv_id;
        insertdata.date = new DatePipe('en-in').transform(this.paramform.value.date, 'yyyy-MM-dd');
        insertdata.checklist = checklist;
        insertdata.checklist_type = this.paramform.value.checklist_type;
        insertdata.fit_status = this.selection.isSelected(item.tv_id);
        insertdata.vc_id = item.vc_id ? item.vc_id : '';
        insertdata.created_by = {login_id:this.currentUser.login_id,full_name:this.currentUser.full_name}
        if (insertdata.vc_id) {
          this.transportService.updateVehicleChecklist([insertdata]).subscribe((result: any) => {
            if (result) {
              this.commonAPIService.showSuccessErrorMessage('Updated successfullt', 'success')
              this.getAllVehicleChecklist();
            } else {
              this.commonAPIService.showSuccessErrorMessage('Error while updating', 'success')
            }
          })
        } else {
          this.transportService.insertVehicleChecklist([insertdata]).subscribe((result: any) => {
            if (result) {
              this.commonAPIService.showSuccessErrorMessage('Inserted successfullt', 'success')
              this.getAllVehicleChecklist();
            } else {
              this.commonAPIService.showSuccessErrorMessage('Error while inserting', 'success')
            }
          })
        }
      }
    }
  }

  fileChangeEvent(fileInput, vcitem) {
    console.log('vcitem',vcitem);
		this.multipleFileArray = [];
		this.counter = 0;
		this.currentFileChangeEvent = fileInput;
		const files = fileInput.target.files;
		for (let i = 0; i < files.length; i++) {
			this.IterateFileLoop(files[i], vcitem);
		}
	}
	IterateFileLoop(files, vcitem) {
		const reader = new FileReader();
		reader.onloadend = (e) => {
			this.currentImage = reader.result;
			const fileJson = {
				fileName: files.name,
				imagebase64: this.currentImage,
				module: 'attachment'
			};
			this.multipleFileArray.push(fileJson);
			this.counter++;
			if (this.counter === this.currentFileChangeEvent.target.files.length) {
				this.sisService.uploadDocuments(this.multipleFileArray).subscribe((result: any) => {
					if (result) {
						for (const item of result.data) {
              const findex = this.documentsArray.findIndex(e => e.tv_id == vcitem.tv_id && e.checklist_type == this.paramform.value.checklist_type && e.cl_id == vcitem.cl_id);
              if(findex != -1){
                this.documentsArray[findex]['document'].push(item);
              }
							// this.imageArray.push({ id: doc_req_id, file_url: item.file_url });

						}
					}
				});
			}
		};
    reader.readAsDataURL(files);
    console.log('this.documentsArray',this.documentsArray)
	}
	previewImage(index, item) {
    const findex = this.documentsArray.findIndex(e => e.tv_id == item.tv_id && e.checklist_type == this.paramform.value.checklist_type && e.cl_id == item.cl_id);

		console.log(this.documentsArray[findex]['document'], index);
		this.dialogRef2 = this.dialog.open(PreviewDocumentComponent, {
			height: '80%',
			width: '1000px',
			data: {
				index: index,
				images: this.documentsArray[findex]['document']
			}
		});
	}
	deleteFile(index,item) {
    const findex = this.documentsArray.findIndex(e => e.tv_id == item.tv_id && e.checklist_type == this.paramform.value.checklist_type && e.cl_id == item.cl_id);
		this.documentsArray[findex]['document'].splice(index, 1);
  }
  getuploadurl(fileurl: string) {
		const filetype = fileurl.substr(fileurl.lastIndexOf('.') + 1);
		if (filetype === 'pdf') {
			return 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/exam/icon-pdf.png';
		} else if (filetype === 'doc' || filetype === 'docx') {
			return 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/exam/icon-word.png';
		} else {
			return fileurl;
		}
	}

}
