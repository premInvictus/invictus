import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService, ExamService } from '../../_services';
import { environment } from '../../../../../../src/environments/environment';

@Component({
  selector: 'app-gradecard-setting',
  templateUrl: './gradecard-setting.component.html',
  styleUrls: ['./gradecard-setting.component.css']
})
export class GradecardSettingComponent implements OnInit {

  gradecaredform: FormGroup;
  ckeConfig: any = {};
  authImage: any;
  showImage = false;
  currentUser: any; 
  classArray: any[] = [];
  constructor(
		private fbuild: FormBuilder,
		private smartService: SmartService,
		public commonService: CommonAPIService,
		public sisService: SisService,
		public examService: ExamService
  ) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.buildForm();
    this.getGlobalSetting();
    this.getClass();
    this.ckeConfig = {
			allowedContent: true,
			pasteFromWordRemoveFontStyles: false,
			contentsCss: ['https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css'],
			disallowedContent: 'm:omathpara',
			height: '300',
			width: '100%',
			// tslint:disable-next-line:max-line-length
			extraPlugins: 'uploadimage,uploadfile,simpleImageUpload',
      scayt_multiLanguageMod: true,
      filebrowserUploadMethod: 'form',
      uploadUrl: environment.apiAxiomUrl+'/uploadS3.php',
      imageUploadUrl:  environment.apiAxiomUrl+'/uploadS3.php',
			filebrowserUploadUrl:  environment.apiAxiomUrl+'/uploadS3.php',
			toolbar: [
				// tslint:disable-next-line:max-line-length
        ['Source', 'Font', 'FontSize', 'Subscript', 'Superscript', 'Videoembed', 'Bold', 'Italic', 'Underline', 'Strikethrough', 'Image', 'Table', 'Templates',
         
          { name: 'UploadImage', items: ['UploadImage'] },
          { name: 'UploadFile', items: [ 'UploadFile' ] },
					{ name: 'SimpleImageUpload', items: ['SimpleImageUpload'] }
      ]
			],
			removeDialogTabs: 'image:advanced;image:Link'
		};
  }
  buildForm(){
    this.gradecaredform = this.fbuild.group({
      gradecard_header: '',
      gradecard_footer: '',
      gradecard_principal_signature: '',
      gradecard_use_principal_signature: '',
      gradecard_use_teacher_signature: '',
      school_attendance_theme: '',
      gradecard_health_status: '',
      comparative_analysis:'',
      student_performance:'',
      gradecard_date: '',
      gradecard_place: '',
      school_achievement:'',
      failure_percentage:'',
      failure_color:''
    })
  }
  getClass() {
		const classParam: any = {};
		classParam.role_id = this.currentUser.role_id;
		classParam.login_id = this.currentUser.login_id;
		this.smartService.getClassData(classParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.classArray = result.data;
					}
				}
			);
	}
  uploadPricipalSign($event) {
    const file: File = $event.target.files[0];
    const reader = new FileReader();
		reader.onloadend = (e) => {
			const fileJson = {
				fileName: file.name,
				imagebase64: reader.result
			};
			this.sisService.uploadDocuments([fileJson]).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.gradecaredform.patchValue({
            gradecard_principal_signature: result.data[0].file_url
          });
				}
			});
		};
		reader.readAsDataURL(file);
	}
  getGlobalSetting() {
    let param: any = {};
    param.gs_name = ['gradecard_header', 'gradecard_health_status','comparative_analysis','student_performance', 'gradecard_footer','gradecard_principal_signature','gradecard_use_principal_signature', 'gradecard_use_teacher_signature','school_attendance_theme','gradecard_date','gradecard_place','school_achievement','failure_percentage','failure_color'];
    this.examService.getGlobalSetting(param).subscribe((result: any) => {
      if(result && result.status === 'ok') {
        const settings = result.data;
        Object.keys(this.gradecaredform.controls).forEach(key => {
          const control = this.gradecaredform.get(key);
          console.log(control);
          settings.forEach(element => {
            if(element.gs_alias === key) {
              if(key === 'gradecard_use_principal_signature') {
                control.setValue(element.gs_value && element.gs_value === '1' ? true : false); 
              } else if(key === 'gradecard_use_teacher_signature') {
                control.setValue(element.gs_value && element.gs_value === '1' ? true : false);
              } else if(key === 'school_attendance_theme') {
                control.setValue(element.gs_value && element.gs_value === '1' ? true : false);
              } else if(key === 'gradecard_health_status') {
                control.setValue(element.gs_value && element.gs_value !== '' ? element.gs_value.split(',') : false);
              } else if(key === 'comparative_analysis') {
                control.setValue(element.gs_value && element.gs_value !== '' ? element.gs_value.split(',') : false);
              } else if(key === 'student_performance') {
                control.setValue(element.gs_value && element.gs_value !== '' ? element.gs_value.split(',') : false);
              } else if(key === 'gradecard_date') {
                control.setValue(element.gs_value && element.gs_value === '1' ? true : false);
              } else if(key === 'gradecard_place') {
                control.setValue(element.gs_value && element.gs_value === '1' ? true : false);
              } else if(key === 'school_achievement') {
                control.setValue(element.gs_value && element.gs_value === '1' ? true : false);
              } else {
                control.setValue(element.gs_value); 
              }              
            }
          });
        })
      }
    })
    console.log(this.gradecaredform.value);
  }

  saveSetting() {
    if (this.gradecaredform.value && this.gradecaredform.value.gradecard_health_status) {
      this.gradecaredform.value.gradecard_health_status = this.gradecaredform.value.gradecard_health_status.join(',').toString();
    }
    if (this.gradecaredform.value && this.gradecaredform.value.comparative_analysis) {
      this.gradecaredform.value.comparative_analysis = this.gradecaredform.value.comparative_analysis.join(',').toString();
    }
    if (this.gradecaredform.value && this.gradecaredform.value.student_performance) {
      this.gradecaredform.value.student_performance = this.gradecaredform.value.student_performance.join(',').toString();
    }
    // console.log('this.gradecaredform.value---', this.gradecaredform.value);
    this.examService.updateGlobalSetting(this.gradecaredform.value).subscribe((result: any) => {
      if(result && result.status === 'ok') {
        // console.log(result.data);
        this.commonService.showSuccessErrorMessage(result.message, 'success');
      } else {
        this.commonService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }

}
