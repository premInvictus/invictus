import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroupDirective, FormControl, NgForm, FormGroup } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, ErrorStateMatcher } from '@angular/material';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
import { SisService } from '../../_services/index';
@Component({
    selector: 'app-backup-and-restore',
    templateUrl: './backup-and-restore.component.html',
    styleUrls: ['./backup-and-restore.component.css']
})
export class BackupAndRestoreComponent implements OnInit {
    backupForm:FormGroup;
    projectArray:any[] = [];

    subModuleArray:any[] = [];
    constructor(public fbuild : FormBuilder, public erpCommonService:ErpCommonService, public commonService:CommonAPIService) {

    }
    ngOnInit() {
        this.buildForm();
        this.getModules();
    }

    buildForm() {
        this.backupForm = this.fbuild.group({

            mod_id:'',
            sub_mod_id:''
        })

    }

    getModules() {
        this.erpCommonService.getProjectList({}).subscribe((data:any)=>{
            this.projectArray = data.data;
        });
    }

    getSubModule() {
        this.erpCommonService.getSubModule({module_id:this.backupForm.value.mod_id}).subscribe((data:any)=>{
            this.subModuleArray = data.data;
        });
    }

    generateBackup() {
        let table_list = [];
        if(this.backupForm.value.sub_mod_id && this.backupForm.value.sub_mod_id.length > 0) {
            for(var i=0; i<this.subModuleArray.length;i++) {
                if (this.backupForm.value.sub_mod_id.indexOf(this.subModuleArray[i]['sub_module_id']) > -1) {
                    for(var j=0; j<this.subModuleArray[i]['tables_listing'].length;j++) {
                        table_list.push(this.subModuleArray[i]['tables_listing'][j]['tb_name']);
                    }
                    
                }
            }
        }
        let inputJson = {}
        console.log('table_list-->', table_list);
        this.erpCommonService.backupDatabase({table_list:table_list}).subscribe((data:any)=>{
            console.log('data--', data);
            this.commonService.showSuccessErrorMessage('Database Backup Created Successfully','success');
        })
    }

    restoreBackup(event) {
        const file = event.target.files[0];
			// const fileReader = new FileReader();
			const formData = new FormData();
			const component = 'Database Restore';
			formData.append('uploadFile', file, file.name);
			formData.append('module' , 'Database Backup and Restore');
			const options = { content: formData,  module : 'Database Backup and Restore', component : 'Database Restore' };
            this.erpCommonService.restoreDatabase(formData).subscribe(
			(result: any) => {
				if (result ) {
					this.commonService.showSuccessErrorMessage('Database Backup Restore successfully', 'success');
				}
			}
		);
    }
}