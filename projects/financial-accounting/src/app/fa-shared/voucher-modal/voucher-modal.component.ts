import { Component, OnInit, Inject, Input, OnChanges } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { FormGroup, FormArray, FormBuilder, Validators } from "@angular/forms";
import {
  SisService,
  CommonAPIService,
  SmartService,
  FaService,
} from "../../_services";
import { forEach } from "@angular/router/src/utils/collection";
import { Element } from "./model";
import {
  MatTableDataSource,
  MatPaginator,
  PageEvent,
  MatSort,
  MatPaginatorIntl,
} from "@angular/material";
import { PreviewDocumentComponent } from '../preview-document/preview-document.component';
@Component({
  selector: "app-voucher-modal",
  templateUrl: "./voucher-modal.component.html",
  styleUrls: ["./voucher-modal.component.css"],
})
export class VoucherModalComponent implements OnInit {
  dtotal = 0;
  ctotal = 0;
  attachmentArray: any[] = [];
  voucherData: any;
  tableDivFlag = false;
  ELEMENT_DATA: Element[];
  displayedColumns: string[] = [
    // "srno",
    "account_code",
    "account",
    "particular",
    "debit",
    "credit",
  ];
  dataSource = new MatTableDataSource<Element>();
  dialogRef2: MatDialogRef<PreviewDocumentComponent>;
  constructor(
    public dialogRef: MatDialogRef<VoucherModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fbuild: FormBuilder,
    private fb: FormBuilder,
    private commonAPIService: CommonAPIService,
    private faService: FaService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    console.log(this.data);
    if (this.data.vc_id) {
      this.getVoucherData(this.data.vc_id);
    }
    this.buildForm();
  }
  buildForm() {}
  getVoucherData(voucherId) {
    this.tableDivFlag = false;
    this.dtotal = 0;
    this.ctotal = 0;
    this.faService
      .getVoucherEntry({ vc_id: voucherId })
      .subscribe((data: any) => {
        if (data) {
          this.voucherData = data;
          this.attachmentArray = data.vc_attachments;
          this.ELEMENT_DATA = [];
          this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
          let pos = 1;
          for (const item of this.voucherData.vc_particulars_data) {
            const element = {
              srno: pos,
              account: item.vc_account_type,
              particular: item.vc_particulars,
              account_code: item.coa_details.coa_code,
              invoiceno: item.vc_invoiceno,
              debit: item.vc_debit,
              credit: item.vc_credit
            };
            this.ctotal += (item.vc_credit ? item.vc_credit: 0);
            this.dtotal += (item.vc_debit ? item.vc_debit: 0)
            this.ELEMENT_DATA.push(element);
            pos++;
          }
          const element = {
            srno: '',
            account: '',
            particular: 'Total',
            account_code:'',
            invoiceno: '',
            debit: this.dtotal,
            credit: this.ctotal
          };
          this.ELEMENT_DATA.push(element);
          this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
          this.tableDivFlag = true;
        } else {
        }
      });
  }

  closeDialog() {
    this.dialogRef.close();
  }
  previewImage(imgArray, index) {
		console.log('imgArray--',imgArray, index);
		this.dialogRef2 = this.dialog.open(PreviewDocumentComponent, {
			data: {
				images: imgArray,
				index: index
			},
			height: '70vh',
			width: '70vh'
		});
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
  getGrno(){
    return this.voucherData.vc_particulars_data[0].vc_grno ? this.voucherData.vc_particulars_data[0].vc_grno : '-';
  }
  getInv(){
    return this.voucherData.vc_particulars_data[0].vc_invoiceno ? this.voucherData.vc_particulars_data[0].vc_invoiceno : '-';
  }
}
