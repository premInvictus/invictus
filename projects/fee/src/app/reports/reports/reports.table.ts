export const reportTable = {
	report: [{
		report_id: '1',
		report_name: 'Fee Collection Report',
		dataReport: {
			headwise: {
				tableHeader: 'Headwise Fee Collection Report',
				columnDef: [],
				colunmHeader: [],
			},
			classwise: {
				tableHeader: 'Classwise Fee Collection Report',
				columnDef: ['srno', 'invoice_created_date', 'stu_admission_no', 'stu_full_name', 'stu_class_name', 'invoice_no', 'receipt_no',
					'rpt_amount', 'fp_name'],
				colunmHeader: ['SNo.', 'Date', 'Enrollment No.', 'Student Name', 'Class-Section', 'Invoice No.', 'Reciept No.',
					'Reciept Amount', 'Fee Period'],
			},
			modewise: {
				tableHeader: 'Modewise Fee Collection Report',
				columnDef: ['srno', 'invoice_created_date', 'stu_admission_no', 'stu_full_name', 'stu_class_name', 'invoice_no', 'receipt_no',
					'rpt_amount', 'fp_name', 'pay_name'],
				colunmHeader: ['SNo.', 'Date', 'Enrollment No.', 'Student Name', 'Class-Section', 'Invoice No.', 'Reciept No.',
					'Reciept Amount', 'Fee Period', 'Fee Payment Mode'],
			},
			routewise: {
				tableHeader: 'Routewise Fee Collection Report',
				columnDef: ['srno', 'invoice_created_date', 'stu_admission_no', 'stu_full_name', 'stu_class_name', 'invoice_no', 'receipt_no',
					'rpt_amount', 'route_name', 'stoppages_name'],
				colunmHeader: ['SNo.', 'Date', 'Enrollment No.', 'Student Name', 'Class-Section', 'Invoice No.', 'Reciept No.',
					'Transport Amount', 'Route Name', 'Stoppage'],
			},
			mfr: {
				tableHeader: 'MRF Report',
				columnDef: [],
				colunmHeader: [],
			},
		}
	},
	{
		report_id: '2',
		report_name: 'Fee Outstanding Report',
		dataReport: {
			headwise: {
				tableHeader: 'Headwise Fee Collection Report',
				columnDef: [],
				colunmHeader: [],
			},
			classwise: {
				tableHeader: 'Classwise Fee Collection Report',
				columnDef: ['srno', 'invoice_created_date', 'stu_admission_no', 'stu_full_name', 'stu_class_name', 'invoice_no', 'receipt_no',
					'rpt_amount', 'fp_name'],
				colunmHeader: ['SNo.', 'Date', 'Enrollment No.', 'Student Name', 'Class-Section', 'Invoice No.', 'Reciept No.',
					'Reciept Amount', 'Fee Period'],
			},
			modewise: {
				tableHeader: 'Modewise Fee Collection Report',
				columnDef: ['srno', 'invoice_created_date', 'stu_admission_no', 'stu_full_name', 'stu_class_name', 'invoice_no', 'receipt_no',
					'rpt_amount', 'fp_name', 'pay_name'],
				colunmHeader: ['SNo.', 'Date', 'Enrollment No.', 'Student Name', 'Class-Section', 'Invoice No.', 'Reciept No.',
					'Reciept Amount', 'Fee Period', 'Fee Payment Mode'],
			},
			routewise: {
				tableHeader: 'Routewise Fee Collection Report',
				columnDef: ['srno', 'invoice_created_date', 'stu_admission_no', 'stu_full_name', 'stu_class_name', 'invoice_no', 'receipt_no',
					'rpt_amount', 'route_name', 'stoppages_name'],
				colunmHeader: ['SNo.', 'Date', 'Enrollment No.', 'Student Name', 'Class-Section', 'Invoice No.', 'Reciept No.',
					'Transport Amount', 'Route Name', 'Stoppage'],
			}
		}
	},
	{
		report_id: '9',
		report_name: 'Missing Fee Invoice',
		dataReport: {
			missingFeeInvoice: {
				tableHeader: 'Missing Fee Invoice Report',
				columnDef: ['srno', 'au_login_id', 'au_full_name', 'fp_name'],
				colunmHeader: ['SNo', 'Enrollment No.', 'Student Name', 'Fee Period'],
			}
		}
	},
	{
		report_id: '11',
		report_name: 'Cheque Clearance Report',
		dataReport: {
			chequeControlList: {
				tableHeader: 'Cheque Clearance Report',
				columnDef: ['srno', 'au_admission_no', 'au_full_name', 'class_name',
					'invoice_no', 'receipt_no', 'receipt_amount', 'bank_name', 'cheque_date', 'cheque_no',
					'dishonor_date', 'status', 'fcc_reason_id', 'fcc_remarks'],
				colunmHeader: ['SNo', 'Enrollment No.', 'Student Name', 'Class-Section', 'Invoice No.', 'Receipt No', 'Amount', 'Bank Name',
					'Cheque Date', 'Cheque No.', 'Dishonoured Date', 'Status', 'Reason', 'Remarks'],
			}
		}
	},
	{
		report_id: '5',
		report_name: 'Fee Ledger Report',
		dataReport: {
			feeLedger: {
				tableHeader: 'Fee Ledger Report',
				columnDef: ['flgr_created_date', 'flgr_particulars',
					'flgr_invoice_receipt_no', 'flgr_amount', 'flgr_concession', 'flgr_receipt', 'flgr_balance'],
				colunmHeader: ['Date',
					'Particulars', 'Invoice/Receipt No', 'Amount Due', 'Concession',
					'Reciept', 'Balance'],
			}
		}
	},
	{
		report_id: '6',
		report_name: 'Deleted Fee Transaction Report',
		dataReport: {
			deletedFeeTransaction: {
				tableHeader: 'Deleted Fee Transaction Report',
				columnDef: ['srno', 'stu_admission_no', 'stu_full_name', 'stu_class_name', 'invoice_no', 'fp_name',
					'invoice_created_date', 'inv_paid_status'],
				colunmHeader: ['SNo', 'Enrollment No.', 'Student Name', 'Class-Section', 'Invoice No.', 'Fee Period', 'Fee Due',
					'Status'],
			}
		}
	},
	{
		report_id: '10',
		report_name: 'Fee Structure Report',
		dataReport: {
			feestructure: {
				tableHeader: 'Fee Structure Report',
				columnDef: ['srno', 'fs_name', 'fs_structure', 'fs_description'],
				colunmHeader: ['SNo.', 'Fee Structure', 'Fee Head', 'Description'],
			},
			feestructurealloted: {
				tableHeader: 'Fee Structure Alloted Report',
				columnDef: ['srno', 'au_admission_no', 'au_full_name', 'class_name',
					'fs_name', 'fs_structure'],
				colunmHeader: ['SNo.', 'Enrollment No.', 'Student Name', 'Class-Section',
					'Fee Structure', 'Fee Head'],
			}
		}
	},
	{
		report_id: '8',
		report_name: 'Fee Concession Report',
		dataReport: {
			concession: {
				tableHeader: 'Fee Concession Report',
				columnDef: ['srno', 'fcc_name', 'fcc_head_type', 'fh_name', 'fcc_class_id', 'fcrt_name', 'fp_name',
					'fcc_amount'],
				colunmHeader: ['Sno.', 'Concession Category', 'Type', 'Fee Head', 'Class', 'Concession Type', 'Fee Period',
					'Concession Amount'],
			},
			concessionAlloted: {
				tableHeader: 'Fee Concession Alloted Report',
				columnDef: ['srno', 'stu_admission_no', 'stu_full_name', 'stu_class_name', 'fee_amount', 'inv_fp_name',
				'concession_cat', 'con_amount'],
				colunmHeader: ['Sno.', 'Enrollment No.', 'Student Name', 'Class-Section', 'Fee Amount', 'Fee Period' ,
				'Concession',
				'Concession Amount'],
			}
		}
	},
	{
		report_id: '7',
		report_name: 'Fee Adjustment Report',
		dataReport: {
			feeAdjustment: {
				tableHeader: 'Fee Adjustment Report',
				columnDef: ['srno', 'au_admission_no', 'au_full_name', 'class_name', 'invoice_no', 'invoice_created_date', 'receipt_no',
					'dishonor_date', 'cheque_date', 'invg_fh_name', 'invg_fh_amount', 'invg_fcc_name', 'invg_adj_amount', 'pay_name',
					'inv_remark'],
				colunmHeader: ['Sno.', 'Enrollment No.', 'Student Name', 'Class-Section', 'Invoice No.', 'Invoice Date', 'Reciept No',
					'Receipt Date' , 'Due Date', 'Fee Head', 'Amount', 'Concession', 'Adjustment', 'Mode',
					'Remarks'],
			}
		}
	},
	{
		report_id: '12',
		report_name: 'Advanced Security Deposit Report',
		dataReport: {
			securityDeposit: {
				tableHeader: 'Advanced Security Deposit Report',
				columnDef: ['srno', 'au_admission_no', 'au_full_name', 'class_name', 'invoice_no', 'receipt_no', 'invoice_created_date',
					'fh_amount'],
				colunmHeader: ['Sno.', 'Enrollment No.', 'Student Name', 'Class-Section', 'Invoice No.', 'Receipt No.', 'Invoice Date',
					'Amount'],
			}
		}
	},
	{
		report_id: '15',
		report_name: 'Transport Report',
		dataReport: {
			transport: {
				tableHeader: 'Transport Report',
				columnDef: ['srno', 'au_admission_no', 'au_full_name', 'class_name', 'route_name', 'slab_name', 'stoppages_name',
					'invoice_created_date', 'cheque_date'],
				colunmHeader: ['Sno.', 'Enrollment No.', 'Student Name', 'Class-Section', 'Route', 'Slab', 'Stoppage',
					'Applicable From', 'Applicable To'],
			}
		}
	}]
};
