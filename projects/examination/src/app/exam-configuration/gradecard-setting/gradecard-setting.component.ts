import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService, ExamService } from '../../_services';

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
  constructor(
		private fbuild: FormBuilder,
		private smartService: SmartService,
		public commonService: CommonAPIService,
		public sisService: SisService,
		public examService: ExamService
  ) { }

  ngOnInit() {
    this.buildForm();
    this.getGlobalSetting();
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
      uploadUrl: 'http://localhost/axiom-backend/uploadS3.php',
      imageUploadUrl: 'https://apiaxiom.invictusdigisoft.com/uploadS3.php',
			filebrowserUploadUrl: 'https://apiaxiom.invictusdigisoft.com/uploadS3.php',
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
      school_attendance_theme: ''
    })
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
    param.gs_name = ['gradecard_header','gradecard_footer','gradecard_principal_signature','gradecard_use_principal_signature', 'gradecard_use_teacher_signature','school_attendance_theme'];
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
                control.setValue(element.gs_value && element.gs_value === '2' ? true : false);
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
    if (this.gradecaredform.value && !(this.gradecaredform.value.school_attendance_theme)) {
      this.gradecaredform.value.school_attendance_theme = '1';
    } else if (this.gradecaredform.value && (this.gradecaredform.value.school_attendance_theme)) { 
      this.gradecaredform.value.school_attendance_theme = '2';
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
