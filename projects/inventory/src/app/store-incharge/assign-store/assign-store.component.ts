import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, InventoryService } from '../../_services';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import {BundleModalComponent} from '../../inventory-shared/bundle-modal/bundle-modal.component';
import { DecimalPipe, DatePipe, TitleCasePipe } from '@angular/common';
import * as Excel from 'exceljs/dist/exceljs';
import { saveAs } from 'file-saver';
const jsPDF = require('jspdf');
import 'jspdf-autotable';
import { IndianCurrency } from 'projects/admin-app/src/app/_pipes';
import * as XLSX from 'xlsx'; 
import 'jspdf-autotable';
import { MatTableDataSource, MatPaginator, PageEvent } from '@angular/material';

@Component({
  selector: 'app-assign-store',
  templateUrl: './assign-store.component.html',
  styleUrls: ['./assign-store.component.css']
})
export class AssignStoreComponent implements OnInit,OnDestroy {
  assignStoreForm: FormGroup;
  existForm: FormGroup;
  notFormatedCellArray: any[] = [];
  currentLocationId: any;
  created_date: any;
  locationDataArray: any[] = [];
  allLocationData: any[] = [];
  itemArray: any[] = [];
  formGroupArray: any[] = [];
  employeeArray: any[] = [];
  locationArray: any[] = [];
  disableApiCall = false;
  employeeId: any;
  locationId: any;
  assignEmpArray: any = {};
  tableDataArray: any[] = [];
  tableDataArrayMain: any[] = [];
  showDefaultData = false;
  currentChildTab='';
  bundleArray: any[] = [];
  edit = false;
  bundleArrayMain: any[] = [];
  schoolInfo: any;
  currentTabIndex: number;
  pageLength = 10;
  pageSize = 10;
  pageSizeOptions = [10, 50, 100];
  tableDivFlag = false;
  tabledataFlag = false;
  ELEMENT_DATA: any[] = [];
  displayedColumns_heading: any = {position:'Sr. No.',item_code:'Item code',item_name:'Item Name', item_quantity:'Item Quantity', item_selling_price:'Selling Price'};
  displayedColumns: string[] = ['position', 'item_code', 'item_name', 'item_quantity', 'item_selling_price'];
dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
@ViewChild(MatPaginator) paginator: MatPaginator;
  priceForm: FormGroup;
  uploadComponent: string;
  sessionName: string;

  reportDate = new DatePipe('en-in').transform(new Date(), 'd-MMM-y');

  alphabetJSON = {
		1: 'A',
		2: 'B',
		3: 'C',
		4: 'D',
		5: 'E',
		6: 'F',
		7: 'G',
		8: 'H',
		9: 'I',
		10: 'J',
		11: 'K',
		12: 'L',
		13: 'M',
		14: 'N',
		15: 'O',
		16: 'P',
		17: 'Q',
		18: 'R',
		19: 'S',
		20: 'T',
		21: 'U',
		22: 'V',
		23: 'W',
		24: 'X',
		25: 'Y',
		26: 'Z',
		27: 'AA',
		28: 'AB',
		29: 'AC',
		30: 'AD',
		31: 'AE',
		32: 'AF',
		33: 'AG',
		34: 'AH',
		35: 'AI',
		36: 'AJ',
		37: 'AK',
		38: 'AL',
		39: 'AM',
		40: 'AN',
		41: 'AO',
		42: 'AP',
		43: 'AQ',
		44: 'AR',

	};
  length: any;
  currentUser: any;
  
  constructor(
    private fbuild: FormBuilder,
    public commonService: CommonAPIService,
    public axiomService: AxiomService,
    public sisService: SisService,
    public inventory: InventoryService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
  ) { 
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')); }

  ngOnInit() {
    this.getSchool();
    this.getAllEmployee();
    this.buildForm();
    if (this.inventory.getAssignEmp()) {
      this.assignEmpArray = this.inventory.getAssignEmp();
      console.log('this.assignEmpArray',this.assignEmpArray);
      if (this.assignEmpArray) {
        this.showDefaultData = true;
        this.existForm.patchValue({
          exist_location_id: this.assignEmpArray.location_id.location_hierarchy,
          exist_emp_id: this.assignEmpArray.emp_name
        });
        this.locationId = Number(this.assignEmpArray.item_location);
        this.editAssignData(this.assignEmpArray);
        this.inventory.resetAssignEmp();
      }
      if(this.inventory.getcurrentChildTab() == 'bundlelist') {
        this.getBundle();
      }
    }
    this.inventory.receipt.subscribe((result: any) => {
      if (result) {
        console.log('result.currentChildTab',result.currentChildTab);
        this.inventory.setcurrentChildTab(result.currentChildTab);
        this.currentChildTab = result.currentChildTab;
        if(result.currentChildTab == 'bundlelist') {
          // this.getBundle();
        }
      }
    });
    this.getAllAssignMaster();
  }
  ngOnDestroy(){
    this.inventory.setcurrentChildTab('');
  }
  buildForm() {
    this.assignStoreForm = this.fbuild.group({
      emp_id: '',
      location_id: ''
    });
    this.existForm = this.fbuild.group({
      exist_location_id: '',
      exist_emp_id: ''
    });

    this.priceForm = this.fbuild.group({
      item_selling_price : ''
    });
    this.formGroupArray = [];
  }

  getAllLocations(){
    this.inventory.getAllLocations({}).subscribe((result: any) => {
      if (result) {
        this.allLocationData = result.data;
      }
    });
  }
  editPrice(item){
    console.log("edit item ", item);
    
  }
  uploadExcel(){
    alert("Hi i am your upload helper");
  }

  downloadTemplate() {
    if (this.uploadComponent === '') {
      this.commonService.showSuccessErrorMessage('Please choose one component for which do you wish to download template', 'error');
    } else {
      this.inventory.downloadEmployeeExcel([
        { component: this.uploadComponent }]).subscribe((result: any) => {
          if (result) {
            this.commonService.showSuccessErrorMessage('Download Successfully', 'success');
            const length = result.fileUrl.split('/').length;
            saveAs(result.fileUrl, result.fileUrl.split('/')[length - 1]);
          } else {
            this.commonService.showSuccessErrorMessage('Error While Downloading File', 'error');
          }
        });
    }
  }

  getAllAssignMaster() {

    if (this.assignStoreForm.valid) {
      this.tableDataArray = [];
      this.tableDataArrayMain = [];
          this.formGroupArray = [];
          this.itemArray = [];
          var filterJson = {
            "filters": [
              {
                "filter_type": "item_location",
                "filter_value": this.locationId,
                "type": "autopopulate"
              }
            ],
            "page_index": 0,
          };
         
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    this.inventory.filterItemsFromMaster(filterJson).subscribe((result: any) => {
      if (result) {
        this.itemArray = result.data;
        let ind = 0;
        this.tableDataArray = [];
        for (let item of this.itemArray) {
          this.tableDataArray.push({
            item_code: item.item_code,
            item_name: item.item_name,
            item_quantity: item.item_location ? item.item_location[0].item_qty : '0',
            item_selling_price: this.getSellingPrice(item.item_code)
          });
          this.tableDataArrayMain.push({
            item_code: item.item_code,
            item_name: item.item_name,
            item_quantity: item.item_location ? item.item_location[0].item_qty : '0',
            item_selling_price: ''
          });
          this.formGroupArray.push({
            formGroup: this.fbuild.group({
              item_code: item.item_code,
              item_name: item.item_name,
              item_quantity: item.item_location[0].item_qty,
              item_selling_price: this.getSellingPrice(item.item_code)
            })
          });
        }
        for (const item of this.itemArray) {
          this.ELEMENT_DATA.push({
            "position": ind + 1,            
            "item_code": item.item_code,
            "item_name": item.item_name,
            "item_quantity": item.item_location ? item.item_location[0].item_qty : '0',
            "item_selling_price": this.getSellingPrice(item.item_code),
            "action": { 'item_code': item.item_code, 'status': item.status }
          });
          ind++;
        }
        this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
        // this.pageLength = this.ELEMENT_DATA.length;
        this.dataSource.paginator = this.paginator;
        this.tableDivFlag = true;
        this.tabledataFlag = true;
      }
      console.log("get all items ", this.dataSource);
    });


    } else {
      this.commonService.showSuccessErrorMessage('please fill required field', 'error');
    }
  }
  
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  editstoreincharge(){
    this.edit = true;
    if(this.assignEmpArray){
      this.assignStoreForm.patchValue({
        'emp_id': this.assignEmpArray.employees.map(e => e.emp_id),
        'location_id': this.assignEmpArray.location_id.location_id
      });
    }
    
  }


	getSchool() {
		this.sisService.getSchool().subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.schoolInfo = res.data[0];
				console.log('this.schoolInfo 202', this.schoolInfo)
				this.schoolInfo['disable'] = true;
				this.schoolInfo['si_school_prefix'] = this.schoolInfo.school_prefix;
				this.schoolInfo['si_school_name'] = this.schoolInfo.school_name;
			}
		});
	}

  addWaterMark(doc) {
    var totalPages = doc.internal.getNumberOfPages();
    // let imgData = this.schoolInfo.school_logo;
    var img = new Image();
    img.src = this.schoolInfo.school_logo;
    // var imgData = 'data:image/jpeg;base64,'+ Base64.encode(this.schoolInfo.school_logo);
    // console.log(imgData);
    
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.addImage(img, 'PNG', 40, 40, 75, 75);
      doc.setTextColor(150);
      // doc.text(50, doc.internal.pageSize.height - 30, 'Watermark');
    }
  
    return doc;
  }
  downloadPdf() {
    var prepare=[];
    console.log(this.tableDataArray);
    let position = 1;
    this.tableDataArray.forEach(e=>{
      var tempObj =[];
      tempObj.push(position);
      tempObj.push(e.item_code);
      tempObj.push(e.item_name);
      tempObj.push( e.item_quantity);
      tempObj.push( e.item_selling_price);
      prepare.push(tempObj);
      position++;
    });
    const doc = new jsPDF('p', 'mm', 'a4');
    doc.autoTable({
        head: [['#','Item Code','Item Name','Item Quantity','Selling Price']],
        body: prepare
    });
    // this.addWaterMark(doc);
    doc.save('assign-item' + '.pdf');
  }

  fileName= 'assign_store.xlsx';  
  exportExcel(): void 
  {
       /* table id is passed over here */   
       let element = document.getElementById('excel-table'); 
       const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
       delete (ws['O6'])

       /* generate workbook and add the worksheet */
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

       /* save to file */
       XLSX.writeFile(wb, this.fileName);
       this.exportAsExcel();
			
  }
  checkWidth(id, header) {
		const res = this.ELEMENT_DATA.map((f) => f[id] !== '-' && f[id] ? f[id].toString().length : 1);
		const max2 = header.toString().length;
		const max = Math.max.apply(null, res);
		return max2 > max ? max2 : max;
	}
	getColor(element) {
		if (element && element.colorCode) {
			return element.colorCode;
		}
	}

	getBorder(element) {
		if (element && element.colorCode) {
			return element.colorCode;
		}
	}

  getLocationName(location_id) {
    const sindex = this.allLocationData.findIndex(f => Number(f.location_id) === Number(location_id));
    if (sindex !== -1) {
      return this.allLocationData[sindex].location_hierarchy;
    } else {
      return '-';
    }
  }

  exportAsExcel() {
    let notExport:string[] = ['action'];
		let reportType: any = '';
		let reportType2: any = '';
    const columns: any = [];
    this.displayedColumns.forEach(element => {
      if(notExport.indexOf(element) == -1) {
        columns.push({
          key: element,
          width: this.checkWidth(element, this.displayedColumns_heading[element])
        });
      }
    });
    console.log(">>>>>>>", this.locationId);
		reportType = new TitleCasePipe().transform('store_item_list: ' + this.getLocationName(this.locationId));
    let reportType1 = new TitleCasePipe().transform('Store Item List: ' + this.getLocationName(this.locationId));
    const fileName =reportType + '_' + this.reportDate +'.xlsx';
		const workbook = new Excel.Workbook();
		const worksheet = workbook.addWorksheet(reportType, { properties: { showGridLines: true } },
			{ pageSetup: { fitToWidth: 7 } });
		worksheet.mergeCells('A1:' + this.alphabetJSON[7] + '1');
		worksheet.getCell('A1').value =
			new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state;
		worksheet.getCell('A1').alignment = { horizontal: 'left' };
		worksheet.mergeCells('A2:' + this.alphabetJSON[7] + '2');
		worksheet.getCell('A2').value = reportType1;
    worksheet.getCell(`A2`).alignment = { horizontal: 'left' };
    this.displayedColumns.forEach((element,index) => {
      console.log('index',index)
      if(notExport.indexOf(element) == -1) {
        worksheet.getCell(this.alphabetJSON[index+1]+'4').value = this.displayedColumns_heading[element];
      }
    });
		worksheet.columns = columns;
    this.length = worksheet._rows.length;
    let srno=1;
		for (const dety of this.ELEMENT_DATA) {
			const obj: any = {};
      this.length++;
      this.displayedColumns.forEach((element,index) => {
        if(notExport.indexOf(element) == -1) {
          worksheet.getCell(this.alphabetJSON[index+1]+this.length).value = dety[element];
        }
      });
			worksheet.addRow(obj);
    }
		worksheet.eachRow((row, rowNum) => {
			if (rowNum === 1) {
				row.font = {
					name: 'Arial',
					size: 16,
					bold: true
				};
			}
			if (rowNum === 2) {
				row.font = {
					name: 'Arial',
					size: 14,
					bold: true
				};
			}
			if (rowNum === 4) {
				row.eachCell(cell => {
					cell.font = {
						name: 'Arial',
						size: 10,
						bold: true,
						color: { argb: '636a6a' }
					};
					cell.fill = {
						type: 'pattern',
						pattern: 'solid',
						fgColor: { argb: 'c8d6e5' },
						bgColor: { argb: 'c8d6e5' },
					};
					cell.border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' }
					};
					cell.alignment = { horizontal: 'center', vertical: 'top', wrapText: true };
				});
			}
			if (rowNum > 4 && rowNum <= worksheet._rows.length) {
				row.eachCell(cell => {
					// tslint:disable-next-line: max-line-length
					if (cell._address.charAt(0) !== 'A' && cell._address.charAt(0) !== 'F' && cell._address.charAt(0) !== 'J' && cell._address.charAt(0) !== 'L') {
						cell.fill = {
							type: 'pattern',
							pattern: 'solid',
							fgColor: { argb: 'ffffff' },
							bgColor: { argb: 'ffffff' },
						};
					}
					cell.font = {
						color: { argb: 'black' },
						bold: false,
						name: 'Arial',
						size: 10
					};
					cell.border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' }
					};
					cell.alignment = { horizontal: 'center', vertical: 'top', wrapText: true };
				});
			}
		});

		worksheet.eachRow((row, rowNum) => {
			if (rowNum === worksheet._rows.length) {
				row.eachCell(cell => {
					cell.fill = {
						type: 'pattern',
						pattern: 'solid',
						fgColor: { argb: '004261' },
						bgColor: { argb: '004261' },
					};
					cell.font = {
						color: { argb: 'ffffff' },
						bold: true,
						name: 'Arial',
						size: 10
					};
					cell.border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' }
					};
					cell.alignment = { horizontal: 'center' };
				});
			}
    });
    worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
      this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
    worksheet.getCell('A' + worksheet._rows.length).value = 'Generated On: '
      + new DatePipe('en-in').transform(new Date(), 'd-MMM-y');
    worksheet.getCell('A' + worksheet._rows.length).font = {
      name: 'Arial',
      size: 10,
      bold: true
    };

    worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
      this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
    worksheet.getCell('A' + worksheet._rows.length).value = 'Generated By: ' + this.currentUser.full_name;
    worksheet.getCell('A' + worksheet._rows.length).font = {
      name: 'Arial',
      size: 10,
      bold: true
    };
		workbook.xlsx.writeBuffer().then(data => {
			const blob = new Blob([data], { type: 'application/octet-stream' });
			saveAs(blob, fileName);
		});

  }

	downloadExcel() {
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Item Price');
   
    worksheet.columns = [
      { header: 'Item Code', key: 'id', width: 10 },
      { header: 'Item Name', key: 'name', width: 32 },
      { header: 'Item Location', key: 'brand', width: 30, default: "location"},
      { header: 'Price', key: 'price', width: 10, style: { font: { name: 'Arial Black', size:10} } },
    ];
	}
  getAllEmployee(){
    this.employeeArray = [];
    this.commonService.getAllEmployee({emp_cat_id:2}).subscribe((result: any) => {
      if (result.length > 0) {
        this.employeeArray = result;
      }
    });
    // this.commonService.getFilterData({}).subscribe((result: any) => {
    //   if (result.status === 'ok') {
    //     tgetSchoolhis.employeeArray = result.data;
    //   }
    // });
  }

  searchStudentByName($event) {
    if (Number($event.keyCode) !== 40 && Number($event.keyCode) !== 38) {
      if ($event.target.value !== '' && $event.target.value.length >= 3) {
        const inputJson = {
          "filters": [
            {
              "filter_type": "emp_name",
              "filter_value": $event.target.value,
              "type": "text"
            }
          ]
        };
        this.employeeArray = [];
        this.commonService.getFilterData(inputJson).subscribe((result: any) => {
          if (result.status === 'ok') {
            this.employeeArray = result.data;
          }
        });
      }
    }
  }
  searchLocationByName($event) {
    if (Number($event.keyCode) !== 40 && Number($event.keyCode) !== 38) {
      if ($event.target.value !== '' && $event.target.value.length >= 3) {
        const inputJson = {
          "filter": $event.target.value,
        };
        this.locationArray = [];
        this.inventory.getParentLocationOnly(inputJson).subscribe((result: any) => {
          if (result) {
            this.locationArray = result;
          }
        });
      }
    }
  }

  getLocationId(item: any) {
    this.locationId = item.location_id;
    this.assignStoreForm.patchValue({
      location_id: item.location_name
    });
  }


  getEmpId(item: any) {
    this.employeeId = item.emp_login_id;
    this.assignStoreForm.patchValue({
      emp_id: item.emp_name
    });
  }

  getFilterLocation(locationData) {
    this.currentLocationId = locationData.location_id;
    this.locationDataArray.push(locationData);
    //console.log(this.currentLocationId);
  }
  getBundle(){
    this.bundleArray = [];
    this.bundleArrayMain = [];
    const param:any = {};
    param.item_location =  this.assignEmpArray.location_id.location_id,
    this.inventory.getAllBundle(param).subscribe((result:any) => {
      if(result && result.length > 0) {
        this.bundleArray = result;
        this.bundleArrayMain = result;
        this.bundleArray.forEach(element => {
          let itemNameArr:any[]=[];
          element.item_assign.forEach(e => {
            itemNameArr.push(new TitleCasePipe().transform(e.selling_item.item_name));
          });
          element['itemNameArr'] = itemNameArr.join(', ');
        });
        console.log('this.bundleArray',this.bundleArray);
      }
    })
  }
  // getItemList() {
  //   if (this.assignStoreForm.valid && this.employeeId) {
  //     this.inventory.checkItemOrLocation({ emp_id: this.employeeId, item_location: this.locationId }).subscribe((result: any) => {
  //       if (result) {
  //         this.tableDataArray = [];
  //         this.formGroupArray = [];
  //         this.itemArray = [];
  //         this.commonService.showSuccessErrorMessage(result, 'error');
  //       } else {
  //         this.tableDataArray = [];
  //         this.formGroupArray = [];
  //         this.itemArray = [];
  //         var filterJson = {
  //           "filters": [
  //             {
  //               "filter_type": "item_location",
  //               "filter_value": this.locationId,
  //               "type": "autopopulate"
  //             }
  //           ],
  //           "page_index": 0,
  //           "page_size": 100
  //         };
  //         this.inventory.filterItemsFromMaster(filterJson).subscribe((result: any) => {
  //           if (result && result.status === 'ok') {
  //             this.itemArray = result.data;
  //             for (let item of this.itemArray) {
  //               this.tableDataArray.push({
  //                 item_code: item.item_code,
  //                 item_name: item.item_name,
  //                 item_quantity: item.item_location ? item.item_location[0].item_qty : '0',
  //                 item_selling_price: ''
  //               });
  //               this.formGroupArray.push({
  //                 formGroup: this.fbuild.group({
  //                   item_code: item.item_code,
  //                   item_name: item.item_name,
  //                   item_quantity: item.item_location[0].item_qty,
  //                   item_selling_price: ''
  //                 })
  //               });
  //             }
  //           } else {
  //             this.commonService.showSuccessErrorMessage('No item added this location', 'error');
  //           }
  //         });
  //       }
  //     });


  //   } else {
  //     this.commonService.showSuccessErrorMessage('please fill required field', 'error');
  //   }

  // }
  getItemList() {
    if (this.assignStoreForm.valid) {
      this.tableDataArray = [];
      this.tableDataArrayMain = [];
          this.formGroupArray = [];
          this.itemArray = [];
          var filterJson = {
            "filters": [
              {
                "filter_type": "item_location",
                "filter_value": this.locationId,
                "type": "autopopulate"
              }
            ],
            "page_index": 0
          };
          this.inventory.filterItemsFromMaster(filterJson).subscribe((result: any) => {
            if (result && result.status === 'ok') {
              this.itemArray = result.data;
              for (let item of this.itemArray) {
                this.tableDataArray.push({
                  item_code: item.item_code,
                  item_name: item.item_name,
                  item_quantity: item.item_location ? item.item_location[0].item_qty : '0',
                  item_selling_price: ''
                });
                this.tableDataArrayMain.push({
                  item_code: item.item_code,
                  item_name: item.item_name,
                  item_quantity: item.item_location ? item.item_location[0].item_qty : '0',
                  item_selling_price: ''
                });
                this.formGroupArray.push({
                  formGroup: this.fbuild.group({
                    item_code: item.item_code,
                    item_name: item.item_name,
                    item_quantity: item.item_location[0].item_qty,
                    item_selling_price: ''
                  })
                });
              }
            } else {
              this.commonService.showSuccessErrorMessage('No item added this location', 'error');
            }
          });


    } else {
      this.commonService.showSuccessErrorMessage('please fill required field', 'error');
    }
  }
  finalSubmit() {
    var finalJson: any = {};
    const itemAssign: any[] = [];
    for (let item of this.formGroupArray) {
      itemAssign.push(item.formGroup.value);
    }
    const emp:any[] = [];
    for(let item of this.assignStoreForm.value.emp_id){
      const temp = this.employeeArray.find(e => e.emp_login_id == item);
      if(temp){
        emp.push({emp_id:temp.emp_login_id,emp_name: temp.emp_name,emp_login_id:temp.emp_login_id})
      }
    }
    finalJson = {
      employees: emp,
      item_location: Number(this.locationId),
      item_assign: itemAssign
    }
    this.inventory.insertStoreIncharge(finalJson).subscribe((result: any) => {
      if (result) {
        if(result != "User is already assigned the store"){
          this.commonService.showSuccessErrorMessage('Price added Successfully', 'success');
        } else {
          this.commonService.showSuccessErrorMessage('User is already assigned the store', 'error');
        }
        
        this.finalCancel();
      } else {
        this.commonService.showSuccessErrorMessage(result, 'error');
      }
    });
  }
  finalUpdate() {
    var finalJson: any = {};
    const itemAssign: any[] = [];    
    for (let item of this.formGroupArray) {
      itemAssign.push(item.formGroup.value);
    }
    console.log(itemAssign);

    const emp:any[] = [];
    for(let item of this.assignStoreForm.value.emp_id){
      const temp = this.employeeArray.find(e => e.emp_login_id == item);
      if(temp){
        emp.push({emp_id:temp.emp_login_id,emp_name: temp.emp_name,emp_login_id:temp.emp_login_id})
      }
    }
    finalJson = {
      employees: emp,
      item_location: Number(this.assignEmpArray.item_location),
      item_assign: itemAssign
    }
    this.inventory.updateStoreIncharge(finalJson).subscribe((result: any) => {
      if (result) {
        this.commonService.showSuccessErrorMessage('Price updated Successfully', 'success');
        this.finalCancel();
        this.inventory.receipt.next({ 'currentTab': 1 });
      } else {
        this.commonService.showSuccessErrorMessage(result, 'error');
      }
    });
  }
  finalCancel() {
    this.formGroupArray = [];
    this.assignEmpArray = [];
    this.tableDataArray = [];
    this.tableDataArrayMain = [];
    this.itemArray = [];
    this.assignStoreForm.patchValue({
      'emp_id': '',
      'location_id': ''
    });
    this.showDefaultData = false;
  }
  editAssignData(itemArray) {
    this.tableDataArray = [];
    this.formGroupArray = [];
    this.itemArray = [];
    var filterJson = {
      "filters": [
        {
          "filter_type": "item_location",
          "filter_value": this.locationId,
          "type": "autopopulate"
        }
      ],
      "page_index": 0
    };
    this.inventory.filterItemsFromMaster(filterJson).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.itemArray = result.data;
        for (let item of this.itemArray) {
          this.tableDataArray.push({
            item_code: item.item_code,
            item_name: item.item_name,
            item_quantity: item.item_location ? item.item_location[0].item_qty : '0',
            item_selling_price: this.getSellingPrice(item.item_code)
          });
          this.formGroupArray.push({
            formGroup: this.fbuild.group({
              item_code: item.item_code,
              item_name: item.item_name,
              item_quantity: item.item_location[0].item_qty,
              item_selling_price: this.getSellingPrice(item.item_code)
            })
          });
        }
      } else {
        this.commonService.showSuccessErrorMessage('No item added this location', 'error');
      }
    });
  }
  getSellingPrice(item_code) {
    const findex = this.assignEmpArray.item_assign.findIndex(f => Number(f.item_code) === Number(item_code));
    if (findex !== -1) {
      return this.assignEmpArray.item_assign[findex].item_selling_price
    } else {
      return '';
    }
  }
  addBundle(value=null){
    console.log('this.assignEmpArray',this.assignEmpArray);
    const item : any = {};
    if(value){
      item.title = 'Update Bundle';
      item.edit = true;
      
    } else {
      item.title = 'Add Bundle';
      item.edit = false;
    }
    item.value = value;
    item.emp_id = this.assignEmpArray.emp_id;
    item.item_location = this.assignEmpArray.item_location;
    const dialogRef = this.dialog.open(BundleModalComponent, {
      width: '50%',
      height: '500',
      data: item
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result && result.status == 'ok'){
        this.getBundle();
      }
    });
  }
  deleteBundle(item){
    console.log(item);
    let param:any = {};
    param.bundle_id = item.bundle_id;
    param.status = '5';
    this.inventory.updateBundle(param).subscribe((result:any) => {
      if(result){
        this.commonService.showSuccessErrorMessage('Updated Successfully','success');
        this.getBundle();
      } else {
        this.commonService.showSuccessErrorMessage('Updated Failed','error');
      }
    })
  }
}
