import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroupDirective, FormControl, NgForm, FormGroup } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, ErrorStateMatcher } from '@angular/material';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
import { SisService} from '../../_services/index';
@Component({
    selector: 'app-setup',
    templateUrl: './setup.component.html',
    styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {
    paramform: FormGroup;
    currentGsetup: string;
    GRADE_CARD_SETTINS: any[] = [];
    classNamegr: any = '';
    secNamegr: any = '';
    termNamegr: any = '';
    examNamegr: any = '';
    subExamNamegr: any = '';
    formFlag = false;
    paymemtgways: any[] = [];
    settingForm: FormGroup;
    formatSettings: any = {};
    printForm: FormGroup;
    idCardSettings: any[] = [];
    idcardForm2: FormGroup;
    gsettingGroupArr: any[] = [];
    gsettingArr: any[] = [];
    configFlag = false;
    checkedArray: any = [];
    bankArr: any[] = [];
    notifConfigArray: any[] = [];
    configValue: any;
    disabledApiButton = false;
    currentUser: any;
    classArray: any[] = [];
    toggleArray: any[] = [
        { id: '1', name: 'Yes' },
        { id: '0', name: 'No' },
    ];
    flaggedForm: FormGroup;
    departmentArray: any[] = [];
    curl_call_urlArray: any[] = [];
    idcardForm: FormGroup;
    pageArray: any[] = [];
    sizeArray: any[] = [{ id: '1', name: 'Extra Large' },
    { id: '2', name: 'Large' },
    { id: '3', name: 'Medium' },
    { id: '4', name: 'Small' },
    { id: '5', name: 'Extra Small' }];
    disableApiCall = false;
    headerforecolor: any;
    payForm: FormGroup
    headerbackcolor: any;
    stunameforecolor: any;
    stunamebackcolor: any;
    icarddetforecolor: any;
    footerforecolor: any;
    footerbackcolor: any;
    showImage = false;
    prefixToggle = "false";
    hideIfBlankFlag = false;
    templateImage: any;
    headerFooterFlag = true;
    receiptHeaderFooterFlag = true;
    showTempImage = false;
    authSignFlag = false;
    schoolLogo: any = '';
    school_logo_image: any;
    showSchoolImage = false;
    showWaterImage = false;
    waterMarkImage: any = '';
    currentImage: any;
    fasignatureForm: any = [];
    gradecardsignatureForm: any = [];
    logoPosition: any[] = [{ id: '1', pos: 'Top' },
    { id: '2', pos: 'Bottom' },
    { id: '3', pos: 'Left' },
    { id: '4', pos: 'Right' }];
    styleArray: any[] = [
        // { ps_card_style: '1', ps_card_style_name: 'Style 1' },
        { ps_card_style: '2', ps_card_style_name: 'Style 1' },
        // { ps_card_style: '3', ps_card_style_name: 'Style 3' }
    ];
    layoutArray: any[] = [
        { ps_card_layout: '1', ps_card_layout_name: 'Landscape' },
        { ps_card_layout: '2', ps_card_layout_name: 'Potrait' }
    ];
    addressFontSize: any[] = [];
    multipleFileArray: any[] = [];
    authImage: any;
    headerforecolor2: any;
    headerbackcolor2: any;
    stunameforecolor2: any;
    stunamebackcolor2: any;
    schoolLogo2: any = '';
    icarddetforecolor2: any;
    footerforecolor2: any;
    footerbackcolor2: any;
    currentImage2: any;
    addressFontSize2: any[] = [];
    multipleFileArray2: any[] = [];
    authImage2: any;
    showImage2 = false;
    hideIfBlankFlag2 = false;
    templateImage2: any;
    showTempImage2 = false;
    authSignFlag2 = false;
    school_logo_image2: any;
    showSchoolImage2 = false;
    showWaterImage2 = false;
    waterMarkImage2: any = '';
    ckeConfig: any = {};
    processForms: any[] = [];
    paymentFormArray: any[] = [];
    processTypes: any[] = [];
    sessionArray: any[] = [];
    accountsArray: any[] = [];
    showClosingSession = false;
    sectionArray: any;
    termsArray: any[];
    classterm: any;
    examArray: any[];
    subexamArray: any[];
    freezUnfreez=1;
    session_freez:any[] = [];
    monthArray:any[] = [];
    session:any;
    sig_positionArray = ['first','last'];
    hrattendanceArray = ['manual','biometric'];
    accession_typeArray = ['single','multiple'];
    constructor(private fbuild: FormBuilder,
        private commonService: CommonAPIService,
        private sisService: SisService,
        private erpCommonService: ErpCommonService) { }

    ngOnInit() {
        this.session = JSON.parse(localStorage.getItem('session'));
        this.ckeConfig = {
            allowedContent: true,
            pasteFromWordRemoveFontStyles: false,
            contentsCss: ['https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css'],
            disallowedContent: 'm:omathpara',
            height: '150',
            width: '100%',
            // tslint:disable-next-line:max-line-length 
            extraPlugins: 'language,html5audio,html5video,clipboard,undo,uploadfile,uploadimage,uploadwidget,filetools,notificationaggregator,notification,simpleImageUpload',
            scayt_multiLanguageMod: true,
            mathJaxLib: '//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML',
            language_list: ['fr:French', 'es:Spanish', 'it:Italian', 'he:Hebrew:rtl', 'pt:Portuguese', 'de:German', 'hi:Hindi'],
            filebrowserUploadMethod: 'form',
            uploadUrl: 'https://apiaxiom.invictusdigisoft.com/upload.php',
            filebrowserImageUploadUrl: 'https://apiaxiom.invictusdigisoft.com/upload.php',
            filebrowserUploadUrl: 'https://apiaxiom.invictusdigisoft.com/upload.php',
            filebrowserBrowseUrl: 'https://apiaxiom.invictusdigisoft.com/upload.php',
            filebrowserImageBrowseUrl: 'https://apiaxiom.invictusdigisoft.com/upload.php',
            toolbar: [
                // tslint:disable-next-line:max-line-length
                ['Source', 'Font', 'FontSize', 'Subscript', 'Superscript', 'Bold', 'Italic', 'Underline', 'StrikeThrough', 'Image', 'Table',
                    // { name: 'Html5audio', items: [ 'Html5audio' ] },
                    // { name: 'Html5video', items: [ 'Html5video' ] },
                    { name: 'UploadFile', items: ['UploadFile'] },
                    { name: 'UploadImage', items: ['UploadImage'] },
                    { name: 'UploadWidget', items: ['UploadWidget'] },
                    { name: 'FileTools', items: ['FileTools'] },
                    { name: 'Notificationsggregator', items: ['Notificationaggregator'] },
                    { name: 'Notification', items: ['Notification'] },
                    { name: 'SimpleImageUpload', items: ['SimpleImageUpload'] }
                ]
            ],
            removeDialogTabs: 'image:advanced;image:Link;html5video:advanced;html5audio:advanced'
        };
        for (let i = 0; i < 100; i++) {
            this.pageArray.push(i + 1);
        }
        for (let i = 0; i < 100; i++) {
            this.addressFontSize.push(i + 1);
        }
        this.buildForm();
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.getSession();
        this.getGlobalSettingGroup();
        this.getClass();
        this.getDepartment();
        this.getPayGways();
        this.getBanks();
        this.getFeeMonths();
    }
    getFeeMonths() {
        this.monthArray = [];
        this.erpCommonService.getFeeMonths({}).subscribe((result: any) => {
          if (result && result.status === 'ok') {
            this.monthArray = result.data;
          } else {
          }
        });
    }
    setSessionFreez(key1,key3){
        if(this.settingForm.value[key1]){
            if(key3 == 'freez') {
                const findex = this.session_freez.findIndex(e => e == this.settingForm.value[key1]);
                if(findex == -1) {
                    this.session_freez.push(this.settingForm.value[key1])
                }
            } else if(key3 == 'unfreez') {
                const findex = this.session_freez.findIndex(e => e == this.settingForm.value[key1]);
                if(findex != -1) {
                    this.session_freez.splice(findex,1);
                }
            }
            console.log(this.session_freez);
        }
    }
    getSession() {
        this.erpCommonService.getSession().subscribe((data: any) => {
            this.sessionArray = data.data;
        })
    }

    getChartsOfAccount() {
        this.erpCommonService.getAllChartsOfAccount({}).subscribe((data: any) => {
            if (data) {
                this.accountsArray = data;
            } else {
                this.accountsArray = [];
            }
        })
    }

    moveClosingBalance() {
        var ses_id = this.settingForm.value.fa_closing_balance_move;
        var matchedIndex;
        var nextSession;
        var nextSessionId;
        for (var i = 0; i < this.sessionArray.length; i++) {
            if (this.sessionArray[i]['ses_id'] === ses_id) {
                matchedIndex = i;
                break;
            }
        }
        if (this.sessionArray[matchedIndex + 1]) {
            nextSession = this.sessionArray[matchedIndex + 1]['ses_name'].split("-")[0];
            nextSessionId = this.sessionArray[matchedIndex + 1]['ses_id'];
        }
        console.log('next_ses_id--', matchedIndex)
        var inputJson = { monthId: 3, coa_id: [], ses_id: ses_id, moveClosingBalance: true };
        this.erpCommonService.getTrialBalance(inputJson).subscribe((data: any) => {
            if (data && data.ledger_data) {
                var tempAccountData: any = [];

                for (var i = 0; i < data.ledger_data.length; i++) {
                    var fJson = {};
                    var closing_balance = 0;
                    closing_balance = this.getDeviation(data.ledger_data[i]);
                    fJson = {
                        coa_id: data.ledger_data[i]['coa_id'],
                        "coa_opening_balance_data": {
                            "opening_balance": closing_balance,
                            "opening_balance_date": nextSession + "-04-01",
                            "opening_balance_month": 4,
                            "opening_balance_year": nextSession,
                            "opening_balance_type": closing_balance > 0 ? "debit" : "credit"
                        },
                        //nextSesId:nextSessionId
                    };
                    tempAccountData.push(fJson);
                }
                console.log('tempAccountData--', tempAccountData)
                if (tempAccountData.length > 0) {
                    this.erpCommonService.updateClosingBalance({ bulkData: tempAccountData }).subscribe((data: any) => {
                        if (data) {
                            this.commonService.showSuccessErrorMessage('Session Data Moved Successfully', 'success');
                        } else {
                            this.commonService.showSuccessErrorMessage('Error While Move Session Data', 'error');
                        }
                    })
                }
            }
        });

        console.log('ses_id', ses_id, this.disabledApiButton)
    }


    getDeviation(param) {
        if (param) {
            var debit_total_f = 0;
            var credit_total_f = 0;
            var deviation_f = 0;
            for (var i = 0; i < param['debit_data'].length; i++) {
                debit_total_f = debit_total_f + (param['debit_data'][i]['vc_credit'] ? param['debit_data'][i]['vc_credit'] : 0);
            }
            for (var i = 0; i < param['credit_data'].length; i++) {
                credit_total_f = credit_total_f + (param['credit_data'][i]['vc_debit'] ? param['credit_data'][i]['vc_debit'] : 0);
            }
            deviation_f = debit_total_f - credit_total_f;
            return deviation_f;
        }
    }
    enableHeaderFooter($event) {
        if (Number($event.value) === 2) {
            this.headerFooterFlag = true;
        } else {
            this.headerFooterFlag = true;
        }
    }

    enableReceiptHeaderFooter($event) {
        if (Number($event.value) === 2) {
            this.headerFooterFlag = true;
        } else {
            this.receiptHeaderFooterFlag = true;
        }
    }
    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;

    }
    checkIfpgEnabled(index) {
        if (this.paymentFormArray.length > 0) {
            if (this.paymentFormArray[index].formGroup.value.enabled === "true") {
                return true;
            } else {
                return false;
            }
        }
    }
    enableDisablePg($event, index) {
        if ($event.checked) {
            this.paymentFormArray[index].formGroup.patchValue({
                'enabled': "true"
            });
            this.checkedArray[index] = "Enabled";
        } else {
            this.paymentFormArray[index].formGroup.patchValue({
                'enabled': "false"
            });
            this.checkedArray[index] = "Disabled";
        }
    }
    getPayGways() {
        this.sisService.getPaymentGateways({}).subscribe((res: any) => {
            if (res && res.status === 'ok') {
                this.paymemtgways = [];
                this.paymentFormArray = [];
                this.paymemtgways = res.data;
                for (const item of this.paymemtgways) {
                    this.paymentFormArray.push({
                        formGroup: this.fbuild.group({
                            enabled: 'false',
                            merchant: '',
                            api_key: '',
                            trans_bnk_id: '0'
                        }),
                        bank_logo: item.bank_logo,
                        bank_name: item.bank_name,
                        bank_alias: item.bank_alias,
                    });
                }
            }
        });
    }
    getDepartment() {
        this.sisService.getDepartment({}).subscribe((result: any) => {
            if (result && result.status == 'ok') {
                this.departmentArray = result.data;

            } else {
                this.departmentArray = [];
            }

        });
    }
    getGlobalSettingGroup() {
        this.gsettingGroupArr = [];
        this.sisService.getGlobalSettingGroup({}).subscribe((res: any) => {
            if (res && res.status === 'ok') {
                this.gsettingGroupArr = res.data;
            }
        });
    }
    getGs_value(element) {
        if (element.gs_type == 'json') {
            if (element.gs_alias === 'library_user_setting') {
                const jsontemp = element.gs_value && element.gs_value !== '' ? JSON.parse(element.gs_value) : '';
                return this.fbuild.array([this.fbuild.group(jsontemp)]);
            } else if (element.gs_alias === 'employee_monthly_leave_credit') {
                const temp = element.gs_value && element.gs_value !== '' ? JSON.parse(element.gs_value) : '';
                const jsontemp = [];
                for (let i = 0; i < this.departmentArray.length; i++) {
                    jsontemp.push(this.fbuild.group({
                        dpt_id: this.departmentArray[i]['dept_id'],
                        leave_credit_count: temp[i] ? temp[i]['leave_credit_count'] : ''
                    }))

                }
                return this.fbuild.array(jsontemp);
            } else if (element.gs_alias === 'admission_process_cutoff') {
                const temp = element.gs_value && element.gs_value !== '' ? JSON.parse(element.gs_value) : '';
                const jsontemp = [];
                for (let i = 0; i < this.classArray.length; i++) {
                    jsontemp.push(this.fbuild.group({
                        class_id: this.classArray[i]['class_id'],
                        cutoff_marks: temp[i] ? temp[i]['cutoff_marks'] : ''
                    }))

                }
                return this.fbuild.array(jsontemp);
            } else if (element.gs_alias === 'school_push_notif') {
                this.notifConfigArray = JSON.parse(element.gs_value);
            } else if (element.gs_alias === 'curl_call_url') {
                this.curl_call_urlArray = element.gs_value && element.gs_value !== '' ? JSON.parse(element.gs_value) : [];
                const jsontemp = [];
                this.curl_call_urlArray.forEach(element => {
                    jsontemp.push(this.fbuild.group({
                        type: element.type,
                        url: element.url
                    }))
                });
                return this.fbuild.array(jsontemp);
            } else if (element.gs_alias === 'result_entry_options') {
                const temp = element.gs_value && element.gs_value !== '' ? JSON.parse(element.gs_value) : [];
                const jsontemp = [];
                temp.forEach(element => {
                    jsontemp.push(this.fbuild.group({
                        id: element.id,
                        value: element.value
                    }))
                });
                return this.fbuild.array(jsontemp);
            } else if (element.gs_alias === 'mis_report_admin') {
                const temp = element.gs_value && element.gs_value !== '' ? JSON.parse(element.gs_value) : [];
                const jsontemp = [];
                temp.forEach(element => {
                    const tempPermission: any[] = [];
                    if (element.permission.length > 0) {
                        element.permission.forEach(element1 => {
                            tempPermission.push(this.fbuild.group({
                                section_name: element1.section_name,
                                status: element1.status
                            }));
                        });
                    }
                    jsontemp.push(this.fbuild.group({
                        id: element.id,
                        name: element.name,
                        email: element.email,
                        permission: this.fbuild.array(tempPermission)
                    }))
                });
                return this.fbuild.array(jsontemp);
            } else if (element.gs_alias === 'mis_report_setting_data') {
                const jsontemp = element.gs_value && element.gs_value !== '' ? JSON.parse(element.gs_value) : '';
                return this.fbuild.array([this.fbuild.group(jsontemp)]);
            }
        }
        if (element.gs_alias === 'gradecard_health_status' || element.gs_alias === 'comparative_analysis' || element.gs_alias === 'student_performance' || element.gs_alias === 'fa_session_freez' || element.gs_alias === 'fa_monthwise_freez') {
            if(element.gs_alias === 'fa_session_freez') {
                this.session_freez = element.gs_value && element.gs_value !== '' ? element.gs_value.split(',') : [];
                console.log('this.session_freez',this.session_freez);
            }
            return element.gs_value && element.gs_value !== '' ? [element.gs_value.split(',')] : [''];
        } else {
            return element.gs_value;
        }
    }
    checkEmployeeIdCardData(data) {
        this.headerforecolor2 = data.ps_header_fore_color;
        this.headerbackcolor2 = data.ps_header_back_color;
        this.stunameforecolor2 = data.ps_student_fore_color;
        this.stunamebackcolor2 = data.ps_student_back_color;
        this.icarddetforecolor2 = data.ps_id_color;
        this.footerforecolor2 = data.ps_footer_fore_color;
        this.footerbackcolor2 = data.ps_footer_back_color;
        this.authImage2 = data.ps_auth_sign;
        this.schoolLogo2 = data.ps_school_logo;
        this.templateImage2 = data.ps_template_image;
        this.waterMarkImage2 = data.ps_watermark_image;
        if (this.templateImage2) {
            this.showTempImage2 = true;
        }
        if (this.waterMarkImage2) {
            this.showWaterImage2 = true;
        }
        if (this.schoolLogo2) {
            this.showSchoolImage2 = true;
        }
        this.showImage2 = true;
        if (Number(data.ps_missing_student) === 1) {
            this.hideIfBlankFlag2 = false;
        } else {
            this.hideIfBlankFlag2 = true;
        }
        if (Number(data.ps_auth_sign_text) === 1) {
            this.authSignFlag2 = true;
        } else {
            this.authSignFlag2 = false;
        }
        this.idcardForm2.patchValue({
            ps_card_style: data.ps_card_style,
            ps_card_layout: data.ps_card_layout,
            ps_per_page: Number(data.ps_per_page),
            ps_border: data.ps_border === true ? true : false,
            ps_back_side: data.ps_back_side === '1' ? true : false,
            ps_barcode: data.ps_barcode === '1' ? true : false,
            ps_guardian_pic: data.ps_guardian_pic === '1' ? true : false,
            ps_parent_pic: data.ps_parent_pic === '1' ? true : false,
            ps_header_fore_color: data.ps_header_fore_color,
            ps_footer_fore_color: data.ps_footer_fore_color,
            ps_student_fore_color: data.ps_student_fore_color,
            ps_student_back_color: data.ps_student_back_color,
            ps_header_back_color: data.ps_header_back_color,
            ps_footer_back_color: data.ps_footer_back_color,
            ps_sch_addr_font_size: Number(data.ps_sch_addr_font_size),
            ps_image_layout_size: data.ps_image_layout_size,
            ps_id_color: data.ps_id_color,
            ps_hide_dob: data.ps_hide_dob === '1' ? true : false,
            ps_hide_transport: data.ps_hide_transport === '1' ? true : false,
            ps_show_authority: data.ps_show_authority === '1' ? true : false,
            ps_show_parent_name: data.ps_show_parent_name === '1' ? true : false,
            ps_show_parent_mobile: data.ps_show_parent_mobile === '1' ? true : false,
            ps_sch_logo: data.ps_sch_logo === '1' ? true : false,
            ps_hide_photo: this.hideIfBlankFlag2 === true ? true : false,
            ps_footer: data.ps_footer,
            ps_content_bold: data.ps_content_bold === '1' ? true : false,
            ps_missing_student: data.ps_missing_student === '1' ? true : false,
            ps_print_parent_card: data.ps_print_parent_card === '1' ? true : false,
            ps_auth_sign_text: data.ps_auth_sign_text === '1' ? true : false,
            ps_show_stu_addr: data.ps_show_stu_addr === '1' ? true : false,
            ps_hide_stu_bg: data.ps_hide_stu_bg === '1' ? true : false,
        });
    }
    checkStudentIdCardData(data) {
        this.headerforecolor = data.ps_header_fore_color;
        this.headerbackcolor = data.ps_header_back_color;
        this.stunameforecolor = data.ps_student_fore_color;
        this.stunamebackcolor = data.ps_student_back_color;
        this.icarddetforecolor = data.ps_id_color;
        this.footerforecolor = data.ps_footer_fore_color;
        this.footerbackcolor = data.ps_footer_back_color;
        this.authImage = data.ps_auth_sign;
        this.schoolLogo = data.ps_school_logo;
        this.templateImage = data.ps_template_image;
        this.waterMarkImage = data.ps_watermark_image;
        if (this.templateImage) {
            this.showTempImage = true;
        }
        if (this.schoolLogo) {
            this.showSchoolImage = true;
        }
        if (this.waterMarkImage) {
            this.showWaterImage = true;
        }
        this.showImage = true;
        if (Number(data.ps_missing_student) === 1) {
            this.hideIfBlankFlag = false;
        } else {
            this.hideIfBlankFlag = true;
        }
        if (Number(data.ps_auth_sign_text) === 1) {
            this.authSignFlag = true;
        } else {
            this.authSignFlag = false;
        }
        this.idcardForm.patchValue({
            ps_card_style: data.ps_card_style,
            ps_card_layout: data.ps_card_layout,
            ps_per_page: Number(data.ps_per_page),
            ps_border: data.ps_border === '1' ? true : false,
            ps_back_side: data.ps_back_side === '1' ? true : false,
            ps_barcode: data.ps_barcode === '1' ? true : false,
            ps_guardian_pic: data.ps_guardian_pic === '1' ? true : false,
            ps_parent_pic: data.ps_parent_pic === '1' ? true : false,
            ps_header_fore_color: data.ps_header_fore_color,
            ps_footer_fore_color: data.ps_footer_fore_color,
            ps_student_fore_color: data.ps_student_fore_color,
            ps_student_back_color: data.ps_student_back_color,
            ps_header_back_color: data.ps_header_back_color,
            ps_footer_back_color: data.ps_footer_back_color,
            ps_sch_addr_font_size: Number(data.ps_sch_addr_font_size),
            ps_image_layout_size: data.ps_image_layout_size,
            ps_id_color: data.ps_id_color,
            ps_hide_dob: data.ps_hide_dob === '1' ? true : false,
            ps_hide_transport: data.ps_hide_transport === '1' ? true : false,
            ps_show_authority: data.ps_show_authority === '1' ? true : false,
            ps_show_parent_name: data.ps_show_parent_name === '1' ? true : false,
            ps_show_parent_mobile: data.ps_show_parent_mobile === '1' ? true : false,
            ps_sch_logo: data.ps_sch_logo === '1' ? true : false,
            ps_hide_photo: this.hideIfBlankFlag === true ? true : false,
            ps_footer: data.ps_footer,
            ps_content_bold: data.ps_content_bold === '1' ? true : false,
            ps_missing_student: data.ps_missing_student === '1' ? true : false,
            ps_print_parent_card: data.ps_print_parent_card === '1' ? true : false,
            ps_auth_sign_text: data.ps_auth_sign_text === '1' ? true : false,
            ps_show_stu_addr: data.ps_show_stu_addr === '1' ? true : false,
            ps_hide_stu_bg: data.ps_hide_stu_bg === '1' ? true : false,
        });
    }
    assignEmailSmsFormats() {
        this.processForms = [
            {
                enquiry: [
                    {
                        formGroup: this.fbuild.group({
                            type: 'sms',
                            value: '',
                            subject: '',
                            enabled: "false"
                        })
                    },
                    {
                        formGroup: this.fbuild.group({
                            type: 'email',
                            subject: '',
                            value: '',
                            enabled: "false"
                        })

                    }
                ]
            },
            {
                registration: [
                    {
                        formGroup: this.fbuild.group({
                            type: 'sms',
                            subject: '',
                            value: '',
                            enabled: "false"
                        })
                    },
                    {
                        formGroup: this.fbuild.group({
                            type: 'email',
                            subject: '',
                            value: '',
                            enabled: "false"
                        })

                    }
                ]
            },
            {
                provisional: [
                    {
                        formGroup: this.fbuild.group({
                            type: 'sms',
                            value: '',
                            subject: '',
                            enabled: "false"
                        })
                    },
                    {
                        formGroup: this.fbuild.group({
                            type: 'email',
                            subject: '',
                            value: '',
                            enabled: "false"
                        })

                    }
                ]
            },
            {
                admission: [
                    {
                        formGroup: this.fbuild.group({
                            type: 'sms',
                            value: '',
                            subject: '',
                            enabled: "false"
                        })
                    },
                    {
                        formGroup: this.fbuild.group({
                            type: 'email',
                            subject: '',
                            value: '',
                            enabled: "false"
                        })

                    }
                ]
            }
        ];
    }
    getClassTerm() {
        this.termsArray = [];
        this.sisService.getClassTerm({ class_id: this.paramform.value.eme_class_id }).subscribe((result: any) => {
            if (result && result.status === 'ok') {
                this.classterm = result.data;
                //console.log(result.data);
                result.data.ect_no_of_term.split(',').forEach(element => {
                    this.termsArray.push({ id: element, name: result.data.ect_term_alias + ' ' + element });
                });
                this.termsArray.push({ id: 'comulative', name: 'Cumulative' });
                this.sisService.getExamPerCumulativeExam({ class_id: this.paramform.value.eme_class_id }).subscribe((result: any) => {
                    if (result && result.status === 'ok') {
                        this.termsArray.push({ id: 'percumulative', name: 'Percentage Cumulative' });
                    } else {

                    }
                })
                console.log('termsArray', this.termsArray);
            } else {
                // this.commonAPIService.showSuccessErrorMessage(result.message, 'error'); 
            }
        });
    }
    changeStat($event, value) {
        if ($event.checked) {
            value.status = '1';
        } else {
            value.status = '0';
        }
    }
    deleteStep(index) {
        this.GRADE_CARD_SETTINS.splice(index, 1);
        console.log(this.GRADE_CARD_SETTINS);
    }
    addSetting() {
        if (this.paramform.value.eme_class_id && this.paramform.value.eme_term_id) {
            const findex = this.GRADE_CARD_SETTINS.findIndex(f => Number(f.class_id) === Number(this.paramform.value.eme_class_id)
                && Number(f.term_id) === Number(this.paramform.value.eme_term_id)
            );

            if (findex === -1) {
                this.GRADE_CARD_SETTINS.push({
                    class_id: this.paramform.value.eme_class_id,
                    class_name: this.classNamegr ? this.classNamegr : '',
                    sec_id: this.paramform.value.eme_sec_id,
                    sec_name: this.secNamegr ? this.secNamegr : '',
                    term_id: this.paramform.value.eme_term_id,
                    term_name: this.termNamegr ? this.termNamegr : '',
                    exam_name: this.examNamegr ? this.examNamegr : '',
                    exam_id: this.paramform.value.eme_exam_id ? this.paramform.value.eme_exam_id : '',
                    sub_exam_id: this.paramform.value.eme_subexam_id ? this.paramform.value.eme_subexam_id : [],
                    sub_exam_name: this.subExamNamegr ? this.subExamNamegr : '',
                    status: '1'
                });
            } else {
                this.GRADE_CARD_SETTINS[findex].sec_id = this.paramform.value.eme_sec_id ? this.paramform.value.eme_sec_id : '';
                this.GRADE_CARD_SETTINS[findex].sec_name = this.secNamegr ? this.secNamegr : '';
                this.GRADE_CARD_SETTINS[findex].term_id = this.paramform.value.eme_term_id ? this.paramform.value.eme_term_id : '';
                this.GRADE_CARD_SETTINS[findex].term_name = this.termNamegr ? this.termNamegr : '';
                this.GRADE_CARD_SETTINS[findex].exam_id = this.paramform.value.eme_exam_id ? this.paramform.value.eme_exam_id : '';
                this.GRADE_CARD_SETTINS[findex].sub_exam_id = this.paramform.value.eme_subexam_id ? this.paramform.value.eme_subexam_id : '';
                this.GRADE_CARD_SETTINS[findex].exam_name = this.examNamegr ? this.examNamegr : '';
                this.GRADE_CARD_SETTINS[findex].sub_exam_name = this.subExamNamegr ? this.subExamNamegr : '';
                this.GRADE_CARD_SETTINS[findex].status = this.GRADE_CARD_SETTINS[findex].status ? this.GRADE_CARD_SETTINS[findex].status : '1';
            }
        } else {
            this.commonService.showSuccessErrorMessage('Please select class and term', 'error');
        }

    }
    getSubExamName($event) {
        this.subExamNamegr = '';
        if ($event.value) {
            setTimeout(() => {
                this.subExamNamegr = $event.source._elementRef.nativeElement.outerText;
            }, 500);
        }
    }
    getSubExam($event) {

        this.examNamegr = '';
        if ($event.value) {
            setTimeout(() => {
                this.examNamegr = $event.source._elementRef.nativeElement.outerText;
            }, 500);
        }
        this.paramform.patchValue({
            eme_subexam_id: ''
        });
        this.subexamArray = [];
        if (this.paramform.value.eme_exam_id) {
            this.sisService.getExamDetails({ exam_class: this.paramform.value.eme_class_id, term_id: this.getTermid(), exam_id: this.paramform.value.eme_exam_id }).subscribe((result: any) => {
                if (result && result.status === 'ok') {
                    if (result.data.length > 0 && result.data[0].exam_sub_exam_max_marks.length > 0) {
                        this.subexamArray = result.data[0].exam_sub_exam_max_marks;
                        console.log(this.subexamArray);
                        const subexam_id_arr: any[] = [];
                        for (let item of this.subexamArray) {
                            subexam_id_arr.push(item.se_id);
                        }
                        const param: any = {};
                        param.ssm_class_id = this.paramform.value.eme_class_id;
                        param.ssm_exam_id = this.paramform.value.eme_exam_id;
                        param.ssm_se_id = subexam_id_arr;
                        param.ssm_sub_id = this.paramform.value.eme_sub_id;
                        this.sisService.getSubjectSubexamMapping(param).subscribe((result: any) => {
                            if (result && result.status === 'ok') {
                                for (let item of result.data) {
                                    for (let item1 of this.subexamArray) {
                                        if (item.ssm_se_id === item1.se_id) {
                                            item1.exam_max_marks = item.ssm_sub_mark;
                                        }
                                    }
                                }
                            }
                        })
                    }
                }
            });
        }
    }
    getSectionsByClass($event) {
        this.classNamegr = '';
        if ($event.value) {
            setTimeout(() => {
                this.classNamegr = $event.source._elementRef.nativeElement.outerText;
            }, 500);
        }
        this.paramform.patchValue({
            eme_sec_id: '',
            eme_term_id: '',
            eme_exam_id: '',
            eme_subexam_id: ''
        });
        this.sectionArray = [];
        this.sisService.getSectionsByClass({ class_id: this.paramform.value.eme_class_id }).subscribe((result: any) => {
            if (result && result.status === 'ok') {
                this.sectionArray = result.data;
            } else {
                this.commonService.showSuccessErrorMessage(result.message, 'error');
            }
        });
    }
    getTermid() {
        if (this.paramform.value.eme_term_id == 'comulative') {
            const termIndex = this.termsArray.findIndex(e => e.id === this.paramform.value.eme_term_id);
            return this.termsArray[termIndex - 1].id;
        } else {
            const termIndex = this.termsArray.findIndex(e => e.id === this.paramform.value.eme_term_id);
            return this.termsArray[termIndex].id;
        }
    }
    getExamDetails($event) {
        this.termNamegr = '';

        this.paramform.patchValue({
            eme_exam_id: '',
            eme_subexam_id: ''
        });
        if ($event.value) {
            setTimeout(() => {
                this.termNamegr = $event.source._elementRef.nativeElement.outerText;
            }, 500);
        }
        this.paramform.patchValue({
            eme_exam_id: '',
            eme_subexam_id: '',
        });
        this.examArray = [];
        this.sisService.getExamDetails({ exam_class: this.paramform.value.eme_class_id, term_id: this.getTermid() }).subscribe((result: any) => {
            if (result && result.status === 'ok') {
                this.examArray = result.data;
            } else {
                // this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
            }
        });
    }
    sectionChange($event) {
        this.secNamegr = '';

        if ($event.value && $event.value.length > 0) {
            setTimeout(() => {
                this.secNamegr = $event.source._elementRef.nativeElement.outerText;
            }, 500);
        }

    }
    getGlobalSetting(value) {
        this.showImage = false;
        this.hideIfBlankFlag = false;
        this.showTempImage = false;
        this.authSignFlag = false;
        this.showSchoolImage = false;
        this.showWaterImage = false;
        this.showImage2 = false;
        this.hideIfBlankFlag2 = false;
        this.showTempImage2 = false;
        this.authSignFlag2 = false;
        this.showSchoolImage = false;
        this.showWaterImage2 = false;
        this.currentGsetup = value;
        this.gsettingArr = [];
        this.processTypes = [];
        this.paramform.reset();
        this.sisService.getGlobalSetting({ gs_group: value, not_json: true }).subscribe((res: any) => {
            if (res && res.status === 'ok') {
                this.gsettingArr = res.data;
                if (this.gsettingArr.length > 0) {
                    const temp: any = {};
                    //temp[element.gs_alias] = this.getGs_value(element)
                    this.gsettingArr.forEach(element => {
                        element.gs_name = element.gs_name.replace(/_/g, ' ');
                        temp[element.gs_alias] = this.getGs_value(element)
                    });
                    this.settingForm = this.fbuild.group(temp);
                    console.log('this.settingForm', this.settingForm)
                    if (this.currentGsetup === 'financial accounting') {
                        console.log('this.session.ses_id ********************',this.session.ses_id,this.settingForm.value.fa_session_freez);
                        this.settingForm.controls.fa_session_freez.setValue(this.session.ses_id);
                        this.checkFreez(this.session.ses_id);
                    }
                    if (this.settingForm && this.settingForm.value && this.settingForm.value.gradecard_report_settings_app) {
                        const gradesSettings: any[] = JSON.parse(this.settingForm.value.gradecard_report_settings_app);
                        this.GRADE_CARD_SETTINS = [];
                        if (gradesSettings && gradesSettings.length > 0) {
                            for (const item of gradesSettings) {
                                this.GRADE_CARD_SETTINS.push({
                                    class_id: item.class_id,
                                    class_name: item.class_name,
                                    sec_id: item.sec_id,
                                    sec_name: item.sec_name,
                                    term_id: item.term_id,
                                    term_name: item.term_name,
                                    exam_name: item.exam_name,
                                    exam_id: item.exam_id,
                                    sub_exam_id: item.sub_exam_id,
                                    sub_exam_name: item.sub_exam_name,
                                    status: item.status
                                });

                            }
                        }
                    }
                    if (this.settingForm && this.settingForm.value && this.settingForm.value.add_prefix_before_admission_no) {
                        const obj: any = JSON.parse(this.settingForm.value.add_prefix_before_admission_no);
                        if (obj && Object.keys(obj).length > 0) {
                            this.prefixToggle = obj.addPrefix;
                        }
                    } else {
                        this.prefixToggle = "false";
                    }
                    if (this.settingForm && this.settingForm.value && this.settingForm.value.enquiry_registration_email_sms) {
                        const processes: any[] = JSON.parse(this.settingForm.value.enquiry_registration_email_sms);
                        this.processTypes = JSON.parse(this.settingForm.value.enquiry_registration_email_sms);
                        if (processes.length > 0) {
                            this.assignEmailSmsFormats();
                            for (const item of processes) {
                                Object.keys(item).forEach((key: any) => {
                                    for (const titem of this.processForms) {
                                        Object.keys(titem).forEach((key2: any) => {
                                            if (key === key2) {
                                                for (const jItem of item[key]) {
                                                    for (const formItem of titem[key2]) {
                                                        if (jItem.type === formItem.formGroup.value.type) {
                                                            formItem.formGroup.patchValue({
                                                                type: jItem.type,
                                                                value: jItem.value,
                                                                subject: jItem.type === 'email' ? (jItem.subject ? jItem.subject : '') : '',
                                                                enabled: jItem.enabled
                                                            });
                                                        }
                                                    }
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                            console.log(this.processForms);
                        } else {
                            this.assignEmailSmsFormats();
                        }
                    }


                    if (this.settingForm && this.settingForm.value && this.settingForm.value.idcard_printsetup) {
                        const cardSettings: any[] = JSON.parse(this.settingForm.value.idcard_printsetup);
                        this.idCardSettings = JSON.parse(this.settingForm.value.idcard_printsetup);
                        if (cardSettings.length > 0) {
                            const findex = cardSettings.findIndex(f => f.type === 'student');
                            if (findex !== -1) {
                                if (Object.keys(cardSettings[findex].details).length > 0) {
                                    console.log(cardSettings[findex].details);
                                    this.checkStudentIdCardData(cardSettings[findex].details);
                                }
                            }
                            const findex2 = cardSettings.findIndex(f => f.type === 'employee');
                            if (findex2 !== -1) {
                                if (Object.keys(cardSettings[findex2].details).length > 0) {
                                    this.checkEmployeeIdCardData(cardSettings[findex2].details);
                                }
                            }
                        } else {
                            this.idCardSettings = [
                                { type: 'student', details: {} },
                                { type: 'employee', details: {} },
                            ];
                        }
                    }

                    if (this.settingForm && this.settingForm.value && this.settingForm.value.employee_salary_slip) {
                        const payJson: any = JSON.parse(this.settingForm.value.employee_salary_slip);
                        if (Object.keys(payJson).length > 0) {
                            this.payForm.patchValue({
                                format: payJson.headerFormat
                            })
                        } else {
                            this.payForm.patchValue({
                                format: ''
                            });
                        }
                    }
                    if (this.settingForm && this.settingForm.value && this.settingForm.value.deduction_config) {
                        const deduction: any = JSON.parse(this.settingForm.value.deduction_config);
                        if (Object.keys(deduction).length > 0) {
                            this.flaggedForm.patchValue({
                                tds: deduction.tds,
                                gratuity: deduction.gratuity
                            });
                        } else {
                            this.flaggedForm.patchValue({
                                tds: false,
                                gratuity: false
                            });
                        }
                    }
                    if (this.settingForm && this.settingForm.value && this.settingForm.value.invoice_receipt_format) {
                        if (Object.keys(this.settingForm.value.invoice_receipt_format).length > 0) {
                            const formatS = JSON.parse(this.settingForm.value.invoice_receipt_format);
                            this.formatSettings = JSON.parse(this.settingForm.value.invoice_receipt_format);
                            if (Number(formatS.spt_print_format) === 2) {
                                this.headerFooterFlag = true;
                            } else {
                                this.headerFooterFlag = true;
                            }
                            if (Number(formatS.spt_print_format_receipt) === 2) {
                                this.receiptHeaderFooterFlag = true;
                            } else {
                                this.receiptHeaderFooterFlag = true;
                            }
                            this.printForm.patchValue({
                                'spt_id': formatS.spt_id,
                                'spt_print_format': formatS.spt_print_format,
                                'spt_invoice_format': formatS.spt_invoice_format,
                                'spt_receipt_format': formatS.spt_receipt_format,
                                'spt_header_template': formatS.spt_header_template,
                                'spt_footer_template': formatS.spt_footer_template,
                                'spt_print_format_receipt': formatS.spt_print_format_receipt,
                                'spt_receipt_header_template': formatS.spt_receipt_header_template,
                                'spt_receipt_footer_template': formatS.spt_receipt_footer_template,
                                'spt_invoice_text_color': formatS.spt_invoice_text_color,
                                'spt_receipt_text_color': formatS.spt_receipt_text_color,
                                'invoice_header_height': formatS.invoice_header_height,
                                'invoice_header_content_height': formatS.invoice_header_content_height,
                                'invoice_content_height': formatS.invoice_content_height,
                                'invoice_footer_height': formatS.invoice_footer_height,
                                'receipt_header_height': formatS.receipt_header_height,
                                'receipt_header_content_height': formatS.receipt_header_content_height,
                                'receipt_format_one_content_height': formatS.receipt_format_one_content_height,
                                'receipt_format_two_content_height': formatS.receipt_format_two_content_height,
                                'receipt_format_three_content_height': formatS.receipt_format_three_content_height,
                                'receipt_footer_height': formatS.receipt_footer_height
                            });
                        } else {
                            this.formatSettings = {};
                        }
                    }
                    if (this.settingForm && this.settingForm.value && this.settingForm.value.payment_banks) {
                        let paymentArr: any[] = [];
                        paymentArr = JSON.parse(this.settingForm.value.payment_banks);
                        if (paymentArr && paymentArr.length > 0) {
                            for (const item of this.paymentFormArray) {
                                for (const titem of paymentArr) {
                                    if (item.bank_alias.toLowerCase() === titem.bank_alias.toLowerCase()) {
                                        item.formGroup.patchValue({
                                            enabled: titem.enabled,
                                            merchant: titem.merchant,
                                            api_key: titem.api_key,
                                            trans_bnk_id: titem.trans_bnk_id
                                        });
                                    }
                                    if (titem.enabled === "true" &&
                                        item.bank_alias.toLowerCase() === titem.bank_alias.toLowerCase()) {
                                        this.checkedArray.push("Enabled");
                                    } else if (titem.enabled !== "true" &&
                                        item.bank_alias.toLowerCase() === titem.bank_alias.toLowerCase()) {
                                        this.checkedArray.push("Disabled");
                                    }
                                }
                            }
                            console.log(this.checkedArray);
                        }
                    }
                    if (this.settingForm && this.settingForm.value && this.settingForm.value.financial_accounting_signature) {
                        console.log('in fa');
                        this.fasignatureForm = [];
                        if (this.settingForm.value.financial_accounting_signature) {
                            let tempSignatureForm = JSON.parse(this.settingForm.value.financial_accounting_signature);
                            for (var i = 0; i < tempSignatureForm.length; i++) {
                                var tForm = this.fbuild.group({
                                    title: tempSignatureForm[i]['title'],
                                    signature: tempSignatureForm[i]['signature'],
                                    order: tempSignatureForm[i]['order']
                                })
                                this.fasignatureForm.push(tForm)
                            }
                        }

                    }
                    if (this.settingForm && this.settingForm.value && this.settingForm.value.gradecard_printing_signature) {
                        console.log('in fa');
                        this.gradecardsignatureForm = [];
                        if (this.settingForm.value.gradecard_printing_signature) {
                            let tempSignatureForm = JSON.parse(this.settingForm.value.gradecard_printing_signature);
                            for (var i = 0; i < tempSignatureForm.length; i++) {
                                var tForm = this.fbuild.group({
                                    title: tempSignatureForm[i]['title'],
                                    signature: tempSignatureForm[i]['signature'],
                                    order: tempSignatureForm[i]['order']
                                })
                                this.gradecardsignatureForm.push(tForm)
                            }
                        }

                    }
                    console.log(this.settingForm);
                }
                this.formFlag = true;
            }
            //console.log(this.settingForm);
        });
    }
    togglePrefix($event) {
        if ($event.checked) {
            this.prefixToggle = "true";

        } else {
            this.prefixToggle = "false";
        }
    }
    enableTDS($event) {
        if ($event.checked) {
            this.flaggedForm.patchValue({
                tds: true
            });
        } else {
            this.flaggedForm.patchValue({
                tds: false
            });
        }
    }
    enableGratuity($event) {
        if ($event.checked) {
            this.flaggedForm.patchValue({
                gratuity: true
            });
        } else {
            this.flaggedForm.patchValue({
                gratuity: false
            });
        }
    }
    buildForm() {
        this.paramform = this.fbuild.group({
            eme_class_id: '',
            eme_sec_id: '',
            eme_term_id: '',
            eme_exam_id: '',
            eme_subexam_id: ''
        });
        this.payForm = this.fbuild.group({
            format: ''
        });
        this.flaggedForm = this.fbuild.group({
            tds: false,
            gratuity: false,
            updateSalaryStructureToEmployee: ''
        });
        this.idcardForm = this.fbuild.group({
            ps_card_style: '',
            ps_card_layout: '',
            ps_per_page: '',
            ps_border: '',
            ps_back_side: '',
            ps_barcode: '',
            ps_guardian_pic: '',
            ps_parent_pic: '',
            ps_header_fore_color: '',
            ps_footer_fore_color: '',
            ps_student_fore_color: '',
            ps_student_back_color: '',
            ps_header_back_color: '',
            ps_footer_back_color: '',
            ps_sch_addr_font_size: '',
            ps_image_layout_size: '',
            ps_id_color: '',
            ps_auth_sign: '',
            ps_hide_dob: '',
            ps_hide_transport: '',
            ps_show_authority: '',
            ps_show_parent_name: '',
            ps_show_parent_mobile: '',
            ps_sch_logo: '',
            ps_footer: '',
            ps_content_bold: '',
            ps_missing_student: '',
            ps_print_parent_card: '',
            ps_auth_sign_text: '',
            ps_hide_photo: '',
            ps_show_stu_addr: '',
            ps_hide_stu_bg: '',
            ps_school_logo: '',
            ps_template_image: '',
            ps_watermark_image: ''
        });
        this.idcardForm2 = this.fbuild.group({
            ps_card_style: '',
            ps_card_layout: '',
            ps_per_page: '',
            ps_border: '',
            ps_back_side: '',
            ps_barcode: '',
            ps_guardian_pic: '',
            ps_parent_pic: '',
            ps_header_fore_color: '',
            ps_footer_fore_color: '',
            ps_student_fore_color: '',
            ps_student_back_color: '',
            ps_header_back_color: '',
            ps_footer_back_color: '',
            ps_sch_addr_font_size: '',
            ps_image_layout_size: '',
            ps_id_color: '',
            ps_auth_sign: '',
            ps_hide_dob: '',
            ps_hide_transport: '',
            ps_show_authority: '',
            ps_show_parent_name: '',
            ps_show_parent_mobile: '',
            ps_sch_logo: '',
            ps_footer: '',
            ps_content_bold: '',
            ps_missing_student: '',
            ps_print_parent_card: '',
            ps_auth_sign_text: '',
            ps_hide_photo: '',
            ps_show_stu_addr: '',
            ps_hide_stu_bg: '',
            ps_school_logo: '',
            ps_template_image: '',
            ps_watermark_image: ''
        });
        this.printForm = this.fbuild.group({
            'spt_id': '',
            'spt_print_format': '',
            'spt_invoice_format': '',
            'spt_receipt_format': '',
            'spt_header_template': '',
            'spt_footer_template': '',
            'spt_print_format_receipt': '',
            'spt_receipt_header_template': '',
            'spt_receipt_footer_template': '',
            'spt_invoice_text_color': '',
            'spt_receipt_text_color': '',
            'invoice_header_height': '',
            'invoice_header_content_height': '',
            'invoice_content_height': '',
            'invoice_footer_height': '',
            'receipt_header_height': '',
            'receipt_header_content_height': '',
            'receipt_format_one_content_height': '',
            'receipt_format_two_content_height': '',
            'receipt_format_three_content_height': '',
            'receipt_footer_height': ''


        });
        let fasignfrm = this.fbuild.group({
            'title': '',
            'signature': '',
            'order': ''
        });
        this.fasignatureForm.push(fasignfrm);
        let gradecardsignfrm = this.fbuild.group({
            'title': '',
            'signature': '',
            'order': ''
        });
        this.gradecardsignatureForm.push(gradecardsignfrm);
    }
    checkIfSelectedSMS(i, j, value) {
        if (this.processForms[i][value][j].formGroup.value.enabled === 'true') {
            return true;
        } else {
            return false;
        }
    }
    checkIfSelectedEmail(i, j, value) {
        if (this.processForms[i][value][j].formGroup.value.enabled === 'true') {
            return true;
        } else {
            return false;
        }
    }
    enableDisableSMS(i, j, value, $event) {
        if ($event.checked) {
            this.processForms[i][value][j].formGroup.patchValue({
                enabled: "true"
            });
        } else {
            this.processForms[i][value][j].formGroup.patchValue({
                enabled: "false"
            });
        }
    }
    enableDisableEmail(i, j, value, $event) {
        if ($event.checked) {
            this.processForms[i][value][j].formGroup.patchValue({
                enabled: "true"
            });
        } else {
            this.processForms[i][value][j].formGroup.patchValue({
                enabled: "false"
            });
        }
    }
    getNameOfStep(index) {
        if (index === 0) {
            return 'Enquiry';
        }
        if (index === 1) {
            return 'Registration';
        }
        if (index === 2) {
            return 'Provisional Admission';
        }
        if (index === 3) {
            return 'Admission';
        }
    }
    updateGlobalSetting() {
        this.disabledApiButton = true;
        if (this.settingForm.value && this.settingForm.value.gradecard_health_status) {
            this.settingForm.value.gradecard_health_status = this.settingForm.value.gradecard_health_status.join(',').toString();
        }
        if (this.settingForm.value && this.settingForm.value.comparative_analysis) {
            this.settingForm.value.comparative_analysis = this.settingForm.value.comparative_analysis.join(',').toString();
        }
        if (this.settingForm.value && this.settingForm.value.student_performance) {
            this.settingForm.value.student_performance = this.settingForm.value.student_performance.join(',').toString();
        }
        if (this.settingForm.value && this.settingForm.value.library_user_setting) {
            this.settingForm.value.library_user_setting = JSON.stringify(this.settingForm.value.library_user_setting[0]);
        }
        if (this.settingForm.value && this.settingForm.value.employee_monthly_leave_credit) {
            this.settingForm.value.employee_monthly_leave_credit = JSON.stringify(this.settingForm.value.employee_monthly_leave_credit);
        }
        if (this.settingForm.value && this.settingForm.value.admission_process_cutoff) {
            this.settingForm.value.admission_process_cutoff = JSON.stringify(this.settingForm.value.admission_process_cutoff);
        }
        if (this.settingForm.value && this.settingForm.value.school_push_notif) {
            this.settingForm.value.school_push_notif = JSON.stringify(this.notifConfigArray);
        }
        if (this.settingForm.value && this.settingForm.value.curl_call_url) {
            this.settingForm.value.curl_call_url = JSON.stringify(this.settingForm.value.curl_call_url);
        }
        if (this.settingForm.value && this.settingForm.value.result_entry_options) {
            this.settingForm.value.result_entry_options = JSON.stringify(this.settingForm.value.result_entry_options);
        }
        if (this.settingForm.value && this.settingForm.value.mis_report_admin) {
            this.settingForm.value.mis_report_admin = JSON.stringify(this.settingForm.value.mis_report_admin);
        }
        if (this.settingForm.value && this.settingForm.value.mis_report_setting_data) {
            this.settingForm.value.mis_report_setting_data = JSON.stringify(this.settingForm.value.mis_report_setting_data[0]);
        }
        if (this.settingForm.value && this.settingForm.value.employee_salary_slip) {
            if (this.payForm.value.format) {
                this.settingForm.value.employee_salary_slip = JSON.stringify({
                    headerFormat: this.payForm.value.format
                });
            }
        }
        if (this.settingForm.value && this.settingForm.value.gradecard_report_settings_app) {
            this.settingForm.value.gradecard_report_settings_app = JSON.stringify(this.GRADE_CARD_SETTINS);
            this.paramform.reset();
        }
        if (this.settingForm.value && this.settingForm.value.deduction_config) {

            this.settingForm.value.deduction_config = JSON.stringify(this.flaggedForm.value);

        }
        if (this.settingForm.value && this.settingForm.value.idcard_printsetup) {
            if (this.idCardSettings.length > 0) {
                const findex = this.idCardSettings.findIndex(f => f.type === 'student');
                if (findex !== -1) {
                    console.log(this.idcardForm);
                    if (this.idcardForm.value.ps_border) {
                        this.idcardForm.value.ps_border = '1';
                    } else {
                        this.idcardForm.value.ps_border = '0';
                    }
                    if (this.idcardForm.value.ps_back_side) {
                        this.idcardForm.value.ps_back_side = '1';
                    } else {
                        this.idcardForm.value.ps_back_side = '0';
                    }
                    if (this.idcardForm.value.ps_barcode) {
                        this.idcardForm.value.ps_barcode = '1';
                    } else {
                        this.idcardForm.value.ps_barcode = '0';
                    }
                    if (this.idcardForm.value.ps_parent_pic) {
                        this.idcardForm.value.ps_parent_pic = '1';
                    } else {
                        this.idcardForm.value.ps_parent_pic = '0';
                    }
                    if (this.idcardForm.value.ps_guardian_pic) {
                        this.idcardForm.value.ps_guardian_pic = '1';
                    } else {
                        this.idcardForm.value.ps_guardian_pic = '0';
                    }
                    if (this.idcardForm.value.ps_hide_dob) {
                        this.idcardForm.value.ps_hide_dob = '1';
                    } else {
                        this.idcardForm.value.ps_hide_dob = '0';
                    }
                    if (this.idcardForm.value.ps_hide_transport) {
                        this.idcardForm.value.ps_hide_transport = '1';
                    } else {
                        this.idcardForm.value.ps_hide_transport = '0';
                    }
                    if (this.idcardForm.value.ps_show_authority) {
                        this.idcardForm.value.ps_show_authority = '1';
                    } else {
                        this.idcardForm.value.ps_show_authority = '0';
                    }
                    if (this.idcardForm.value.ps_show_parent_name) {
                        this.idcardForm.value.ps_show_parent_name = '1';
                    } else {
                        this.idcardForm.value.ps_show_parent_name = '0';
                    }
                    if (this.idcardForm.value.ps_show_parent_mobile) {
                        this.idcardForm.value.ps_show_parent_mobile = '1';
                    } else {
                        this.idcardForm.value.ps_show_parent_mobile = '0';
                    }
                    if (this.idcardForm.value.ps_sch_logo) {
                        this.idcardForm.value.ps_sch_logo = '1';
                    } else {
                        this.idcardForm.value.ps_sch_logo = '0';
                    }
                    if (this.idcardForm.value.ps_hide_photo) {
                        this.idcardForm.value.ps_hide_photo = '1';
                    } else {
                        this.idcardForm.value.ps_hide_photo = '0';
                    }
                    if (this.idcardForm.value.ps_content_bold) {
                        this.idcardForm.value.ps_content_bold = '1';
                    } else {
                        this.idcardForm.value.ps_content_bold = '0';
                    }
                    if (this.idcardForm.value.ps_missing_student) {
                        this.idcardForm.value.ps_missing_student = '1';
                    } else {
                        this.idcardForm.value.ps_missing_student = '0';
                    }
                    if (this.idcardForm.value.ps_print_parent_card) {
                        this.idcardForm.value.ps_print_parent_card = '1';
                    } else {
                        this.idcardForm.value.ps_print_parent_card = '0';
                    }
                    if (this.idcardForm.value.ps_auth_sign_text) {
                        this.idcardForm.value.ps_auth_sign_text = '1';
                    } else {
                        this.idcardForm.value.ps_auth_sign_text = '0';
                    }
                    if (this.idcardForm.value.ps_show_stu_addr) {
                        this.idcardForm.value.ps_show_stu_addr = '1';
                    } else {
                        this.idcardForm.value.ps_show_stu_addr = '0';
                    }
                    if (this.idcardForm.value.ps_hide_stu_bg) {
                        this.idcardForm.value.ps_hide_stu_bg = '1';
                    } else {
                        this.idcardForm.value.ps_hide_stu_bg = '0';
                    }
                    this.idcardForm.value.ps_auth_sign = this.authImage;
                    this.idcardForm.value.ps_school_logo = this.schoolLogo;
                    this.idcardForm.value.ps_template_image = this.templateImage;
                    this.idcardForm.value.ps_watermark_image = this.waterMarkImage;
                    this.idCardSettings[findex].details = this.idcardForm.value;
                }
                const findex2 = this.idCardSettings.findIndex(f => f.type === 'employee');
                if (findex2 !== -1) {
                    if (this.idcardForm2.value.ps_border) {
                        this.idcardForm2.value.ps_border = '1';
                    } else {
                        this.idcardForm2.value.ps_border = '0';
                    }
                    if (this.idcardForm2.value.ps_back_side) {
                        this.idcardForm2.value.ps_back_side = '1';
                    } else {
                        this.idcardForm2.value.ps_back_side = '0';
                    }
                    if (this.idcardForm2.value.ps_barcode) {
                        this.idcardForm2.value.ps_barcode = '1';
                    } else {
                        this.idcardForm2.value.ps_barcode = '0';
                    }
                    if (this.idcardForm2.value.ps_parent_pic) {
                        this.idcardForm2.value.ps_parent_pic = '1';
                    } else {
                        this.idcardForm2.value.ps_parent_pic = '0';
                    }
                    if (this.idcardForm2.value.ps_guardian_pic) {
                        this.idcardForm2.value.ps_guardian_pic = '1';
                    } else {
                        this.idcardForm2.value.ps_guardian_pic = '0';
                    }
                    if (this.idcardForm2.value.ps_hide_dob) {
                        this.idcardForm2.value.ps_hide_dob = '1';
                    } else {
                        this.idcardForm2.value.ps_hide_dob = '0';
                    }
                    if (this.idcardForm2.value.ps_hide_transport) {
                        this.idcardForm2.value.ps_hide_transport = '1';
                    } else {
                        this.idcardForm2.value.ps_hide_transport = '0';
                    }
                    if (this.idcardForm2.value.ps_show_authority) {
                        this.idcardForm2.value.ps_show_authority = '1';
                    } else {
                        this.idcardForm2.value.ps_show_authority = '0';
                    }
                    if (this.idcardForm2.value.ps_show_parent_name) {
                        this.idcardForm2.value.ps_show_parent_name = '1';
                    } else {
                        this.idcardForm2.value.ps_show_parent_name = '0';
                    }
                    if (this.idcardForm2.value.ps_show_parent_mobile) {
                        this.idcardForm2.value.ps_show_parent_mobile = '1';
                    } else {
                        this.idcardForm2.value.ps_show_parent_mobile = '0';
                    }
                    if (this.idcardForm2.value.ps_sch_logo) {
                        this.idcardForm2.value.ps_sch_logo = '1';
                    } else {
                        this.idcardForm2.value.ps_sch_logo = '0';
                    }
                    if (this.idcardForm2.value.ps_hide_photo) {
                        this.idcardForm2.value.ps_hide_photo = '1';
                    } else {
                        this.idcardForm2.value.ps_hide_photo = '0';
                    }
                    if (this.idcardForm2.value.ps_content_bold) {
                        this.idcardForm2.value.ps_content_bold = '1';
                    } else {
                        this.idcardForm2.value.ps_content_bold = '0';
                    }
                    if (this.idcardForm2.value.ps_missing_student) {
                        this.idcardForm2.value.ps_missing_student = '1';
                    } else {
                        this.idcardForm2.value.ps_missing_student = '0';
                    }
                    if (this.idcardForm2.value.ps_print_parent_card) {
                        this.idcardForm2.value.ps_print_parent_card = '1';
                    } else {
                        this.idcardForm2.value.ps_print_parent_card = '0';
                    }
                    if (this.idcardForm2.value.ps_auth_sign_text) {
                        this.idcardForm2.value.ps_auth_sign_text = '1';
                    } else {
                        this.idcardForm2.value.ps_auth_sign_text = '0';
                    }
                    if (this.idcardForm2.value.ps_show_stu_addr) {
                        this.idcardForm2.value.ps_show_stu_addr = '1';
                    } else {
                        this.idcardForm2.value.ps_show_stu_addr = '0';
                    }
                    if (this.idcardForm2.value.ps_hide_stu_bg) {
                        this.idcardForm2.value.ps_hide_stu_bg = '1';
                    } else {
                        this.idcardForm2.value.ps_hide_stu_bg = '0';
                    }
                    this.idcardForm2.value.ps_auth_sign = this.authImage2;
                    this.idcardForm2.value.ps_school_logo = this.schoolLogo2;
                    this.idcardForm2.value.ps_template_image = this.templateImage2;
                    this.idcardForm2.value.ps_watermark_image = this.waterMarkImage2;
                    this.idCardSettings[findex2].details = this.idcardForm2.value;

                }
                this.settingForm.value.idcard_printsetup = JSON.stringify(this.idCardSettings);
            }
        }
        if (this.settingForm.value && this.settingForm.value.invoice_receipt_format) {
            this.formatSettings = this.printForm.value;
            this.settingForm.value.invoice_receipt_format = JSON.stringify(this.formatSettings);
        }
        if (this.settingForm.value && this.settingForm.value.add_prefix_before_admission_no) {
            this.settingForm.value.add_prefix_before_admission_no = JSON.stringify({ addPrefix: this.prefixToggle })
        }
        if (this.settingForm.value && this.settingForm.value.enquiry_registration_email_sms) {
            const finalDataArr: any[] = [
                { enquiry: [] },
                { registration: [] },
                { provisional: [] },
                { admission: [] }
            ];
            for (const item of this.processForms) {
                Object.keys(item).forEach((key: any) => {
                    for (const titem of finalDataArr) {
                        Object.keys(titem).forEach((key2: any) => {
                            if (key2 === key) {
                                const innerData: any[] = [];
                                for (const inner of item[key]) {
                                    innerData.push(inner.formGroup.value);
                                }
                                titem[key] = innerData;
                            }
                        });
                    }
                });
            }
            this.settingForm.value.enquiry_registration_email_sms = JSON.stringify(finalDataArr);
        }
        if (this.settingForm.value && this.settingForm.value.payment_banks) {
            if (this.paymentFormArray.length > 0) {
                const finalPayArr: any[] = [];
                for (const item of this.paymentFormArray) {
                    finalPayArr.push({
                        bank_name: item.bank_name,
                        bank_alias: item.bank_alias,
                        bank_logo: item.bank_logo,
                        enabled: item.formGroup.value.enabled,
                        merchant: item.formGroup.value.merchant,
                        api_key: item.formGroup.value.api_key,
                        trans_bnk_id: item.formGroup.value.trans_bnk_id
                    });
                }

                this.settingForm.value.payment_banks = JSON.stringify(finalPayArr);
            }
        }
        if (this.showClosingSession) {
            this.moveClosingBalance();
        }
        if (this.flaggedForm.value.updateSalaryStructureToEmployee == true) {
            this.erpCommonService.updateSalaryStructureToEmployee({}).subscribe((result: any) => {
                if (result) {
                    this.commonService.showSuccessErrorMessage('Update Salary Structure To Employee Successpully', 'success');
                } else {
                    this.commonService.showSuccessErrorMessage('Erro to update', 'error');
                }
            });
        }

        if (this.currentGsetup === 'financial accounting') {
            if (this.fasignatureForm.length > 0) {
                var tempSignatureArr = [];
                for (var i = 0; i < this.fasignatureForm.length; i++) {
                    tempSignatureArr.push({
                        'title': this.fasignatureForm[i].value.title,
                        'signature': this.fasignatureForm[i].value.signature,
                        'order': this.fasignatureForm[i].value.order
                    });
                }
                this.settingForm.value.financial_accounting_signature = JSON.stringify(tempSignatureArr)
            }
            this.settingForm.value.fa_session_freez = this.session_freez.join(',');
            this.settingForm.value.fa_monthwise_freez = this.settingForm.value.fa_monthwise_freez ? this.settingForm.value.fa_monthwise_freez.join(','):'';
        }
        if (this.currentGsetup === 'examination') {
            if (this.gradecardsignatureForm.length > 0) {
                var tempSignatureArr = [];
                for (var i = 0; i < this.gradecardsignatureForm.length; i++) {
                    tempSignatureArr.push({
                        'title': this.gradecardsignatureForm[i].value.title,
                        'signature': this.gradecardsignatureForm[i].value.signature,
                        'order': this.gradecardsignatureForm[i].value.order
                    });
                }
                this.settingForm.value.gradecard_printing_signature = JSON.stringify(tempSignatureArr)
            }
        }

        if (this.settingForm.value && this.settingForm.value.admit_code_reset === '1') {
            this.sisService.resetAdmitCode({}).subscribe((data: any) => {


            })
        }

        console.log(this.settingForm.value, this.currentGsetup);
        this.erpCommonService.updateGlobalSetting(this.settingForm.value).subscribe((result: any) => {
            if (result && result.status === 'ok') {
                this.disabledApiButton = false;
                this.fasignatureForm = [];
                this.gradecardsignatureForm = [];
                this.commonService.showSuccessErrorMessage(result.message, result.status);
                this.getGlobalSetting(this.currentGsetup);
            } else {
                this.disabledApiButton = false;
                this.commonService.showSuccessErrorMessage(result.message, result.status);
            }
        });


    }
    getBanks() {
        this.erpCommonService.getBanks({}).subscribe((res: any) => {
            if (res && res.status === 'ok') {
                this.bankArr = [];
                this.bankArr = res.data;
            }
        });
    }
    uploadFile($event, gs_alias) {
        const file: File = $event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = (e) => {
            const fileJson = {
                fileName: file.name,
                imagebase64: reader.result
            };
            this.sisService.uploadDocuments([fileJson]).subscribe((result: any) => {
                if (result.status === 'ok') {
                    this.settingForm.get(gs_alias).patchValue(result.data[0].file_url);
                }
            });
        };
        reader.readAsDataURL(file);
    }
    getClass() {
        const classParam: any = {};
        classParam.role_id = this.currentUser.role_id;
        classParam.login_id = this.currentUser.login_id;
        this.sisService.getClass(classParam)
            .subscribe(
                (result: any) => {
                    if (result && result.status === 'ok') {
                        this.classArray = result.data;
                    }
                }
            );
    }
    checkSubMenuCheckLevel(item) {
        let count = 0;
        if (item.sub_module && item.sub_module.length > 0) {
            if (item.sub_module.length > 1) {
                for (const sm of item.sub_module) {
                    if (sm['status'] === "true") {
                        count++;
                    }
                }
            }
            if (count > 0 && count < item.sub_module.length) {
                return true;
            }
        } else {
            return false;
        }
    }
    checkMenu(item) {
        let count = 0;
        if (item.sub_module && item.sub_module.length > 0) {
            for (const sm of item.sub_module) {
                if (sm['status'] === "true") {
                    count++;
                }
            }
            if (count > 0 && count == item.sub_module.length) {
                return true;
            }
        } else {
            if (item.status === 'true') {
                return true;
            } else {
                return false;
            }
        }
    }
    getSubMenuCheck(item) {
        if (item['status'] === "true") {
            return true;
        } else {
            return false;
        }
    }
    changeMenu(item, $event) {
        if (item.sub_module && item.sub_module.length > 0) {
            if ($event.checked) {
                for (const sitem of item.sub_module) {
                    sitem['status'] = "true";
                }
            } else {
                for (const sitem of item.sub_module) {
                    sitem['status'] = "false";
                }
            }
        } else {
            if ($event.checked) {
                item['status'] = "true";
            } else {
                item['status'] = "false";
            }
        }
    }
    changeSubMenu(item, $event) {
        if ($event.checked) {
            item['status'] = "true";
        } else {
            item['status'] = "false";
        }
    }
    uploadAuthSign($event) {
        this.multipleFileArray = [];
        const files: FileList = $event.target.files;
        for (let i = 0; i < files.length; i++) {
            this.IterateFileLoop(files[i]);
        }
    }
    IterateFileLoop(files) {
        const reader = new FileReader();
        reader.onloadend = (e) => {
            this.currentImage = reader.result;
            const fileJson = {
                fileName: files.name,
                imagebase64: this.currentImage
            };
            this.multipleFileArray.push(fileJson);
            this.sisService.uploadDocuments(this.multipleFileArray).subscribe((result: any) => {
                if (result.status === 'ok') {
                    this.authImage = result.data[0].file_url;
                    this.showImage = true;
                }
            });
        };
        reader.readAsDataURL(files);
    }
    uploadLogo($event) {
        this.multipleFileArray = [];
        const files: FileList = $event.target.files;
        for (let i = 0; i < files.length; i++) {
            this.IterateFileLoop2(files[i]);
        }
    }
    IterateFileLoop2(files) {
        const reader = new FileReader();
        reader.onloadend = (e) => {
            this.currentImage = reader.result;
            const fileJson = {
                fileName: files.name,
                imagebase64: this.currentImage
            };
            this.multipleFileArray.push(fileJson);
            this.sisService.uploadDocuments(this.multipleFileArray).subscribe((result: any) => {
                if (result.status === 'ok') {
                    this.schoolLogo = result.data[0].file_url;
                    this.showSchoolImage = true;
                }
            });
        };
        reader.readAsDataURL(files);
    }
    uploadTempImage($event) {
        this.multipleFileArray = [];
        const files: FileList = $event.target.files;
        for (let i = 0; i < files.length; i++) {
            this.IterateFileLoop3(files[i]);
        }
    }
    IterateFileLoop3(files) {
        const reader = new FileReader();
        reader.onloadend = (e) => {
            this.currentImage = reader.result;
            const fileJson = {
                fileName: files.name,
                imagebase64: this.currentImage
            };
            this.multipleFileArray.push(fileJson);
            this.sisService.uploadDocuments(this.multipleFileArray).subscribe((result: any) => {
                if (result.status === 'ok') {
                    this.templateImage = result.data[0].file_url;
                    this.showTempImage = true;
                }
            });
        };
        reader.readAsDataURL(files);
    }
    uploadWaterImage($event) {
        this.multipleFileArray = [];
        const files: FileList = $event.target.files;
        for (let i = 0; i < files.length; i++) {
            this.IterateFileLoop4(files[i]);
        }
    }
    IterateFileLoop4(files) {
        const reader = new FileReader();
        reader.onloadend = (e) => {
            this.currentImage = reader.result;
            const fileJson = {
                fileName: files.name,
                imagebase64: this.currentImage
            };
            this.multipleFileArray.push(fileJson);
            this.sisService.uploadDocuments(this.multipleFileArray).subscribe((result: any) => {
                if (result.status === 'ok') {
                    this.waterMarkImage = result.data[0].file_url;
                    this.showWaterImage = true;
                }
            });
        };
        reader.readAsDataURL(files);
    }
    idCardMissing($event) {
        if ($event.checked === true) {
            this.idcardForm.patchValue({
                ps_hide_photo: false
            });
            this.hideIfBlankFlag = false;
        } else {
            this.hideIfBlankFlag = true;
        }
    }
    checkAuthStatus($event) {
        if ($event.checked === true) {
            this.authSignFlag = true;
            this.idcardForm.patchValue({
                ps_auth_sign_text: true
            });
        } else {
            this.authSignFlag = false;
            this.idcardForm.patchValue({
                ps_auth_sign: this.authImage ? this.authImage : ''
            });
            this.idcardForm.patchValue({
                ps_auth_sign_text: false
            });
        }
    }
    getHeaderForeColorChange($event) {
        this.headerforecolor = $event;
        this.idcardForm.patchValue({
            ps_header_fore_color: this.headerforecolor
        });
    }
    getHeaderBackColorChange($event) {
        this.headerbackcolor = $event;
        this.idcardForm.patchValue({
            ps_header_back_color: this.headerbackcolor
        });
    }
    getStuNameForeColorChange($event) {
        this.stunameforecolor = $event;
        this.idcardForm.patchValue({
            ps_student_fore_color: this.stunameforecolor
        });
    }
    getStuNameBackColorChange($event) {
        this.stunamebackcolor = $event;
        this.idcardForm.patchValue({
            ps_student_back_color: this.stunamebackcolor
        });
    }
    getICardForeColorChange($event) {
        this.icarddetforecolor = $event;
        this.idcardForm.patchValue({
            ps_id_color: this.icarddetforecolor
        });
    }
    getFooterBackColorChange($event) {
        this.footerbackcolor = $event;
        this.idcardForm.patchValue({
            ps_footer_back_color: this.footerbackcolor
        });
    }
    getFooterForeColorChange($event) {
        this.footerforecolor = $event;
        this.idcardForm.patchValue({
            ps_footer_fore_color: this.footerforecolor
        });
    }
    deleteImageTemp() {
        this.showTempImage = false;
        this.templateImage = 'https://www.publicdomainpictures.net/pictures/200000/t2/plain-white-background-1480544970glP.jpg';
    }
    uploadAuthSign2($event) {
        this.multipleFileArray2 = [];
        const files: FileList = $event.target.files;
        for (let i = 0; i < files.length; i++) {
            this.IterateFileLoop22(files[i]);
        }
    }
    IterateFileLoop22(files) {
        const reader = new FileReader();
        reader.onloadend = (e) => {
            this.currentImage2 = reader.result;
            const fileJson = {
                fileName: files.name,
                imagebase64: this.currentImage2
            };
            this.multipleFileArray2.push(fileJson);
            this.sisService.uploadDocuments(this.multipleFileArray2).subscribe((result: any) => {
                if (result && result.status === 'ok') {
                    this.authImage2 = result.data[0].file_url;
                    this.showImage2 = true;
                }
            });
        };
        reader.readAsDataURL(files);
    }
    uploadLogo2($event) {
        this.multipleFileArray2 = [];
        const files: FileList = $event.target.files;
        for (let i = 0; i < files.length; i++) {
            this.IterateFileLoop24(files[i]);
        }
    }
    IterateFileLoop24(files) {
        const reader = new FileReader();
        reader.onloadend = (e) => {
            this.currentImage2 = reader.result;
            const fileJson = {
                fileName: files.name,
                imagebase64: this.currentImage2
            };
            this.multipleFileArray2.push(fileJson);
            this.sisService.uploadDocuments(this.multipleFileArray2).subscribe((result: any) => {
                if (result.status === 'ok') {
                    this.schoolLogo2 = result.data[0].file_url;
                    this.showSchoolImage2 = true;
                }
            });
        };
        reader.readAsDataURL(files);
    }
    uploadTempImage2($event) {
        this.multipleFileArray2 = [];
        const files: FileList = $event.target.files;
        for (let i = 0; i < files.length; i++) {
            this.IterateFileLoop32(files[i]);
        }
    }
    IterateFileLoop32(files) {
        const reader = new FileReader();
        reader.onloadend = (e) => {
            this.currentImage = reader.result;
            const fileJson = {
                fileName: files.name,
                imagebase64: this.currentImage2
            };
            this.multipleFileArray.push(fileJson);
            this.sisService.uploadDocuments(this.multipleFileArray2).subscribe((result: any) => {
                if (result.status === 'ok') {
                    this.templateImage2 = result.data[0].file_url;
                    this.showTempImage2 = true;
                }
            });
        };
        reader.readAsDataURL(files);
    }
    uploadWaterImage2($event) {
        this.multipleFileArray = [];
        const files: FileList = $event.target.files;
        for (let i = 0; i < files.length; i++) {
            this.IterateFileLoop42(files[i]);
        }
    }
    IterateFileLoop42(files) {
        const reader = new FileReader();
        reader.onloadend = (e) => {
            this.currentImage = reader.result;
            const fileJson = {
                fileName: files.name,
                imagebase64: this.currentImage2
            };
            this.multipleFileArray.push(fileJson);
            this.sisService.uploadDocuments(this.multipleFileArray2).subscribe((result: any) => {
                if (result.status === 'ok') {
                    this.waterMarkImage2 = result.data[0].file_url;
                    this.showWaterImage2 = true;
                }
            });
        };
        reader.readAsDataURL(files);
    }
    idCardMissing2($event) {
        if ($event.checked === true) {
            this.idcardForm2.patchValue({
                ps_hide_photo: false
            });
            this.hideIfBlankFlag2 = false;
        } else {
            this.hideIfBlankFlag2 = true;
        }
    }
    checkAuthStatus2($event) {
        if ($event.checked === true) {
            this.authSignFlag2 = true;
            this.idcardForm2.patchValue({
                ps_auth_sign_text: true
            });
        } else {
            this.authSignFlag2 = false;
            this.idcardForm2.patchValue({
                ps_auth_sign: this.authImage2 ? this.authImage2 : ''
            });
            this.idcardForm2.patchValue({
                ps_auth_sign_text: true
            });
        }
    }
    getHeaderForeColorChange2($event) {
        this.headerforecolor2 = $event;
        this.idcardForm2.patchValue({
            ps_header_fore_color: this.headerforecolor2
        });
    }
    getHeaderBackColorChange2($event) {
        this.headerbackcolor2 = $event;
        this.idcardForm2.patchValue({
            ps_header_back_color: this.headerbackcolor2
        });
    }
    getStuNameForeColorChange2($event) {
        this.stunameforecolor2 = $event;
        this.idcardForm2.patchValue({
            ps_student_fore_color: this.stunameforecolor2
        });
    }
    getStuNameBackColorChange2($event) {
        this.stunamebackcolor2 = $event;
        this.idcardForm2.patchValue({
            ps_student_back_color: this.stunamebackcolor2
        });
    }
    getICardForeColorChange2($event) {
        this.icarddetforecolor2 = $event;
        this.idcardForm2.patchValue({
            ps_id_color: this.icarddetforecolor2
        });
    }
    getFooterBackColorChange2($event) {
        this.footerbackcolor2 = $event;
        this.idcardForm2.patchValue({
            ps_footer_back_color: this.footerbackcolor2
        });
    }
    getFooterForeColorChange2($event) {
        this.footerforecolor2 = $event;
        this.idcardForm2.patchValue({
            ps_footer_fore_color: this.footerforecolor2
        });
    }
    deleteImageTemp2() {
        this.showTempImage2 = false;
        this.templateImage2 = 'https://www.publicdomainpictures.net/pictures/200000/t2/plain-white-background-1480544970glP.jpg';
    }

    addSignature() {
        let fasignfrm = this.fbuild.group({
            'title': '',
            'signature': '',
            'order': ''
        });
        this.fasignatureForm.push(fasignfrm);
    }

    removeSignature(fi) {
        console.log('fi--', fi)
        this.fasignatureForm.splice(fi, 1);
    }

    deleteSignatureImage(fitem, fi) {
        console.log('fitem', fitem, fi);
        console.log('fitem1', this.fasignatureForm[fi]);
        this.fasignatureForm[fi]['value']['signature'] = '';
    }
    uploadSignatureFile($event, fi) {
        const file: File = $event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = (e) => {
            const fileJson = {
                fileName: file.name,
                imagebase64: reader.result
            };
            this.sisService.uploadDocuments([fileJson]).subscribe((result: any) => {
                if (result.status === 'ok') {
                    console.log('this.fasignatureForm[fi]--', this.fasignatureForm[fi])
                    this.fasignatureForm[fi].get('signature').patchValue(result.data[0].file_url);
                    console.log('this.fasignatureForm[fi]--', this.fasignatureForm[fi])
                    //this.settingForm.get(gs_alias).patchValue(result.data[0].file_url);
                }
            });
        };
        reader.readAsDataURL(file);
    }
    addSignature_gradecard() {
        let gradecardsignfrm = this.fbuild.group({
            'title': '',
            'signature': '',
            'order': ''
        });
        this.gradecardsignatureForm.push(gradecardsignfrm);
    }

    removeSignature_gradecard(fi) {
        console.log('fi--', fi)
        this.gradecardsignatureForm.splice(fi, 1);
    }

    deleteSignatureImage_gradecard(fitem, fi) {
        console.log('fitem', fitem, fi);
        console.log('fitem1', this.gradecardsignatureForm[fi]);
        this.gradecardsignatureForm[fi]['value']['signature'] = '';
    }
    checkFreez(value){
        console.log(value);
        console.log('fa_session_freez',this.session_freez);
        const findex = this.session_freez.findIndex(e => e == value);
        if(findex == -1) {
            this.freezUnfreez = 1;
        } else {
            this.freezUnfreez = 2;
        }
    }
    uploadSignatureFile_gradecard($event, fi) {
        const file: File = $event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = (e) => {
            const fileJson = {
                fileName: file.name,
                imagebase64: reader.result
            };
            this.sisService.uploadDocuments([fileJson]).subscribe((result: any) => {
                if (result.status === 'ok') {
                    console.log('this.gradecardsignatureForm[fi]--', this.gradecardsignatureForm[fi])
                    this.gradecardsignatureForm[fi].get('signature').patchValue(result.data[0].file_url);
                    console.log('this.gradecardsignatureForm[fi]--', this.gradecardsignatureForm[fi])
                    //this.settingForm.get(gs_alias).patchValue(result.data[0].file_url);
                }
            });
        };
        reader.readAsDataURL(file);
    }
}