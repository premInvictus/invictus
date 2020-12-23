import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { DatePipe } from '@angular/common';
import { FeeService, SisService, CommonAPIService } from '../../../_services';
import { MatTableDataSource, MatPaginator, PageEvent, MatPaginatorIntl, MatSort } from '@angular/material';
import { ErpCommonService } from 'src/app/_services';
const jsPDF = require('jspdf');
import 'jspdf-autotable';
import { TitleCasePipe, DatePipe } from '@angular/common';
import { CapitalizePipe } from '../../../_pipes';
@Component({
  selector: 'app-bounced-cheque-multiple',
  templateUrl: './bounced-cheque-multiple.component.html',
  styleUrls: ['./bounced-cheque-multiple.component.css']
})
export class BouncedChequeMultipleComponent implements OnInit {
  studentDetails: any = {};
  finalArray: any[] = [];
  defaultSrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/man.svg';
  //,'bankdeposite'
  displayedColumns = ['srno', 'recieptno', 'admno', 'studentnam', 'studenttags', 'class_name', 'fee', 'amount', 'chequeno', 'drawnbankname'];
  bouncedForm: FormGroup;
  reasonArray: any[] = [];
  gender: any;
  defaultsrc: any;
  banks: any[] = [];
  CHEQUE_ELEMENT_DATA: any[] = [];
  dataSource = new MatTableDataSource<any>(this.CHEQUE_ELEMENT_DATA);
  allBanks: any[] = [];
  totalRecords: number;
  currentUser: any;
  schoolInfo: any;
  sessionArray: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<BouncedChequeMultipleComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public fbuild: FormBuilder,
    public feeService: FeeService,
    public sisService: SisService,
    public commonAPIService: CommonAPIService,
    public erpCommonService: ErpCommonService
  ) { }


  ngOnInit() {
    this.buildForm();
    this.getReason();
    this.getBanks();
    this.getAllBanks();
    this.getSession();
    this.getSchool();
    this.studentDetails = this.data;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log('studentDetails', this.studentDetails);
  }
  buildForm() {
    this.bouncedForm = this.fbuild.group({
      'ftr_deposit_bnk_id': this.data.ftr_deposit_bnk_id ? this.data.ftr_deposit_bnk_id : '',
      'fcc_deposite_date': this.data.fcc_deposite_date ? this.data.fcc_deposite_date : '',
      'fcc_ftr_id': this.data.fee_transaction_id ? this.data.fee_transaction_id : '',
      'fcc_dishonor_date': this.data.dishonor_date ? this.data.dishonor_date : '',
      'fcc_bank_code': this.data.fcc_bank_code ? this.data.fcc_bank_code : '',
      'fcc_reason_id': this.data.fcc_bank_code ? this.data.fcc_bank_code : '',
      'fcc_remarks': this.data.fcc_remarks ? this.data.fcc_remarks : '',
      'fcc_process_date': this.data.fcc_process_date ? this.data.fcc_process_date : '',
      'fcc_status': this.data.fcc_status ? this.data.fcc_status : 'd',
      'fcc_inv_id': this.data.invoice_id ? this.data.invoice_id : '',
    });
  }
  getReason() {
    this.reasonArray = [];
    this.sisService.getReason({ reason_type: '11' }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.reasonArray = result.data;
      }
    });
  }
  getBanks() {
    this.banks = [];
    // this.feeService.getBanks({}).subscribe((result: any) => {
    //   if (result && result.status === 'ok') {
    //     this.banks = result.data;
    //     this.allBanks = result.data;
    //   }
    // });
    this.feeService.getBanks({}).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        for (var i = 0; i < result.data.length; i++) {
          if ((!(result.data[i]['bnk_module_list'] == '')) || (result.data[i]['bnk_module_list'].includes('fees'))) {
            this.banks.push(result.data[i]);
          }
        }
        console.log('banks--',this.banks);
      }
    });
  }
  closeModal() {
    this.dialogRef.close({ status: '0' });
  }
  isExistUserAccessMenu(actionT) {
    return this.commonAPIService.isExistUserAccessMenu(actionT);
  }
  submit(event) {
    let finalArray: any[] = [];
    for (let item of this.studentDetails) {
      if (this.bouncedForm.value.fcc_status === 'cd') {
        this.bouncedForm.value.fcc_status = 'c';
      }
      finalArray.push({
        fcc_id: item.fcc_id,
        ftr_deposit_bnk_id: this.bouncedForm.value.ftr_deposit_bnk_id,
        fcc_deposite_date: this.bouncedForm.value.fcc_deposite_date ?
          this.commonAPIService.dateConvertion(this.bouncedForm.value.fcc_deposite_date, 'yyyy-MM-dd') : '',
        fcc_ftr_id: item.fee_transaction_id,
        fcc_dishonor_date: this.bouncedForm.value.fcc_dishonor_date ?
          this.commonAPIService.dateConvertion(this.bouncedForm.value.fcc_dishonor_date, 'yyyy-MM-dd') : '',
        fcc_bank_code: this.bouncedForm.value.fcc_bank_code ? this.bouncedForm.value.fcc_bank_code : '',
        fcc_reason_id: this.bouncedForm.value.fcc_reason_id ? this.bouncedForm.value.fcc_reason_id : '',
        fcc_remarks: this.bouncedForm.value.fcc_remarks,
        fcc_process_date: this.bouncedForm.value.fcc_process_date ?
          this.commonAPIService.dateConvertion(this.bouncedForm.value.fcc_process_date, 'yyyy-MM-dd') : '',
        fcc_status: this.bouncedForm.value.fcc_status,
        fcc_inv_id: item.invoice_id
      });
    }
    this.feeService.addMultipleCheckControlTool(finalArray).subscribe((result: any) => {
      if (result && result.status === 'ok') {

        if (event) {
          this.CHEQUE_ELEMENT_DATA = [];

          this.dataSource = new MatTableDataSource<any>(this.CHEQUE_ELEMENT_DATA);
          this.submitAndPrint();
          // this.dialogRef.close({ status: '1' });
        } else {
          this.studentDetails = [];
          this.CHEQUE_ELEMENT_DATA = [];

          this.dataSource = new MatTableDataSource<any>(this.CHEQUE_ELEMENT_DATA);
          this.dialogRef.close({ status: '1' });
        }


      } else {
        this.commonAPIService.showSuccessErrorMessage('Some error occured while insert', 'error');
      }
    });
  }

  getSession() {
    this.sisService.getSession().subscribe((result2: any) => {
      if (result2.status === 'ok') {
        this.sessionArray = result2.data;
        this.getSchool();
      }
    });
  }

  getSchool() {
    this.erpCommonService.getSchool()
      .subscribe(
        (result: any) => {
          if (result && result.status === 'ok') {
            this.schoolInfo = result.data[0];
          }
        });
  }

  getAllBanks() {
    this.allBanks = [];
    this.feeService.getBanks({}).subscribe((result: any) => {
    	if (result && result.status === 'ok') {
    		this.allBanks = result.data;
    	}
    });
    
  }

  getBankInfo(bnk_id) {
    console.log('bnk_id', bnk_id);
    console.log('allBanks', this.allBanks);
    var bankOInfo: any;
    for (var i = 0; i < this.allBanks.length; i++) {
      if (Number(this.allBanks[i]['bnk_gid'] === bnk_id)) {
        bankOInfo = this.allBanks[i];
      }
    }
    return bankOInfo;
  }
  getSessionName(id) {
    const findex = this.sessionArray.findIndex(f => f.ses_id === id);
    if (findex !== -1) {
      return this.sessionArray[findex].ses_name;
    }
  }

  downloadPdf() {
    console.log(this.bouncedForm.value.fcc_deposite_date);
    var fromDate1 = this.bouncedForm.value.fcc_deposite_date ? this.bouncedForm.value.fcc_deposite_date : '';
    var toDate1 = this.bouncedForm.value.fcc_deposite_date ? this.bouncedForm.value.fcc_deposite_date : '';
    var fromDate = fromDate1 ? this.commonAPIService.dateConvertion(fromDate1, "dd-MMM-yyyy") : 'N/A';
    var toDate = toDate1 ? this.commonAPIService.dateConvertion(toDate1, "dd-MMM-yyyy") : 'N/A';
    var session = this.getSessionName(JSON.parse(localStorage.getItem('session'))['ses_id']);
    var bankInfo = this.getBankInfo(this.bouncedForm.value.ftr_deposit_bnk_id);
    let bankName = bankInfo && bankInfo['bank_name'] ? (bankInfo['bank_name']).toUpperCase() : '';
    let bankAccNo = bankInfo && bankInfo['bnk_account_no'] ? bankInfo['bnk_account_no'] : '';
    let bankBranch = bankInfo && bankInfo['bnk_branch'] ? bankInfo['bnk_branch'] : '';
    console.log('bankInfo', bankInfo,this.bouncedForm.value.ftr_deposit_bnk_id);
    console.log('this.CHEQUE_ELEMENT_DATA', this.dataSource, localStorage.getItem('session'));
    setTimeout(() => {
      const doc = new jsPDF('portrait');

      doc.autoTable({
        margin: { top: 10, right: 10, bottom: 10, left: 10 },
      })

      doc.autoTable({
        head: [[new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state]],
        didDrawPage: function (data) {
          doc.setFont('Roboto');
        },
        headerStyles: {
          fontStyle: 'bold',
          fillColor: '#ffffff',
          textColor: '#ff0000',
          halign: 'center',
          fontSize: 20,
        },
        useCss: true,
        theme: 'striped'
      });

      if (bankName && bankAccNo) {
        let bankFullName = '';
        bankFullName = bankBranch ? bankName + ', ' + bankBranch + ',  A/C No. ' + bankAccNo : bankName + '  A/C No. ' + bankAccNo;
        doc.autoTable({
          head: [[
            new TitleCasePipe().transform(bankFullName)
          ]],
          didDrawPage: function (data) {
            doc.setFont('Roboto');
          },
          headerStyles: {
            fontStyle: 'italic',
            fillColor: '#ffffff',
            textColor: 'black',
            halign: 'center',
            fontSize: 16,
          },
          useCss: true,
          theme: 'striped'
        });
      }

      doc.autoTable({
        head: [[
          { content: 'Date : ' + fromDate + " to " + toDate, styles: { halign: 'left', fillColor: '#ffffff' } },
          // {content: toDate,  styles: {halign: 'left', fillColor: '#ffffff'}},
          { content: 'Session : ' + session, styles: { halign: 'right', fillColor: '#ffffff' } }
        ]],


        headerStyles: {
          fontStyle: 'bold',
          fillColor: '#ffffff',
          textColor: 'black',
          fontSize: 14,
        },
        useCss: true,
        theme: 'grid'
      });

      doc.autoTable({
        html: '#cheque_control_list1',
        headerStyles: {
          minCellWidth: 18.5,
          fontStyle: 'normal',
          fillColor: '#ffffff',
          textColor: 'black',
          fontSize: 6,
          cellPadding: 5
        },
        useCss: true,
        styles: {
          fontSize: 6,
          minCellWidth: 18.5,

          textColor: 'black',
          lineColor: '#89A8C9',
          cellPadding: 5
        },
        theme: 'grid'
      });

      doc.autoTable({
        head: [[
          { content: 'Dated : ' + (fromDate1 ? this.commonAPIService.dateConvertion(fromDate1, "dd-MMM-yyyy") : ''), styles: { halign: 'left', fillColor: '#ffffff' } },
          { content: 'Generated By : ' + this.currentUser.full_name, styles: { halign: 'left', fillColor: '#ffffff' } },
          { content: 'Deposited By  ', styles: { halign: 'left', fillColor: '#ffffff' } }
        ]],

        headerStyles: {
          fontStyle: 'italic',
          fillColor: '#ffffff',
          textColor: 'black',
          fontWeight: 'bold',
          fontSize: 12,
        },
        useCss: true,
        theme: 'grid'
      });

      // doc.autoTable({
      // 	head: [['No. of Records : ' + this.dataSource.filteredData.length]],
      // 	didDrawPage: function (data) {
      // 		doc.setFont('Roboto');
      // 	},
      // 	headerStyles: {
      // 		fontStyle: 'bold',
      // 		fillColor: '#ffffff',
      // 		textColor: 'black',
      // 		halign: 'left',
      // 		fontSize: 10,
      // 	},
      // 	useCss: true,
      // 	theme: 'striped'
      // });


      doc.save('ChequeControl_' + (new Date).getTime() + '.pdf');

      this.dialogRef.close({ status: '1' });
      this.studentDetails = [];

    }, 1000);

  }

  submitAndPrint() {
    console.log('submit and print1', this.studentDetails);


    this.CHEQUE_ELEMENT_DATA = [];

    this.dataSource = new MatTableDataSource<any>(this.CHEQUE_ELEMENT_DATA);

    let pos = 1;
    const temparray = this.studentDetails.length > 0 ? this.studentDetails : [this.studentDetails];
    let total = 0;
    for (const item of temparray) {
      this.CHEQUE_ELEMENT_DATA.push({
        position: pos,
        srno: item,
        class_name: item.class_name + (item.sec_name ? ' ' + item.sec_name : ''),
        chequeno: item.cheque_no,
        admno: item.inv_process_usr_no,
        studentname: item.au_full_name,
        studenttags: item.tag_name ? item.tag_name : '',
        recieptno: item.receipt_no,
        amount: item.receipt_amount,
        bankname: item.bank_name,
        drawnbankname: item.drawnbankname,
        entered_by: item.created_by,
        approved_by: item.approved_by ? item.approved_by : '-',
        recieptdate: new DatePipe('en-in').transform(item.transaction_date, 'd-MMM-y'),
        bankdeposite: item.fcc_deposite_date ? new DatePipe('en-in').transform(this.bouncedForm.value.fcc_deposite_date, 'd-MMM-y') : '-',
        processingdate: item.fcc_process_date ? this.commonAPIService.dateConvertion(item.fcc_process_date, 'd-MMM-y') : '-',
        remarks: item.fcc_remarks ? new CapitalizePipe().transform(item.fcc_remarks) : '-',
        action: item,
        ftr_family_number: item.ftr_family_number ? item.ftr_family_number : '-',
        selectionDisable: item.fcc_status === 'c' || item.fcc_status === 'b' ? true : false,
        fee: item.inv_fp_name ? JSON.parse(item.inv_fp_name)[0] : ''
      });
      total = total + Number(item.receipt_amount);


      pos++;
    }
    this.CHEQUE_ELEMENT_DATA.push({
      position: '',
      srno: '',
      class_name: '',
      chequeno: '',
      admno: '',
      studentname: '',
      studenttags: '',
      recieptno: '',
      amount: total,
      bankname: '',
      entered_by: '',
      approved_by: '',
      recieptdate: '',
      bankdeposite: '',
      processingdate: '',
      remarks: '',
      action: '',
      ftr_family_number: '',
      selectionDisable: true,
      fee: 'Total'
    });
    this.dataSource = new MatTableDataSource<any>(this.CHEQUE_ELEMENT_DATA);
    this.downloadPdf();
  }

}
