import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AdminService } from '../../user-type/admin/services/admin.service';
import { ActivatedRoute } from '@angular/router';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { BreadCrumbService } from '../../_services/breadcrumb.service';
import { QelementService } from '../../questionbank/service/qelement.service';
import { UserAccessMenuService, NotificationService, TreeviewService, CommonAPIService } from '../../_services/index';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-assign-rights-multiple',
  templateUrl: './assign-rights-multiple.component.html',
  styleUrls: ['./assign-rights-multiple.component.css']
})
export class AssignRightsMultipleComponent implements OnInit {
  moduleItems: TreeviewItem[] = [];
  finalAssignedModules: any[] = [];
  textRights = 'Web View';
  moduleValues: string[] = [];
  classItems: TreeviewItem[] = [];
  classValues: string[];
  classArray: any[] = [];
  projectsArray: any[] = [];
  moduleArray: any[] = [];
  assignedModuleArray: any[] = [];
  userDetails: any = {};
  homeUrl: string;
  ModuleForm: FormGroup;
  ClassModuleForm: FormGroup;
  moduleDivFlag = false;
  manageAccessDiv = false;
  role_id: any;
  isApp = false;
  submitButton = true;
  multiRightsArr: any[] = [];
  loginArray: any[] = [];
  projectBasedMenus: any[] = [];
  typeVal = 'web';
  config = TreeviewConfig.create({
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 300
  });
  typeArray = [
    { id: 'web', name: 'Desktop' },
    { id: 'app', name: 'Mobile' }
  ];
  constructor(
    private adminService: AdminService,
    @Inject(MAT_DIALOG_DATA) private data,
    private dialogRef: MatDialogRef<AssignRightsMultipleComponent>,
    private fbuild: FormBuilder,
    private common: CommonAPIService,
    private route: ActivatedRoute,
    private qelementService: QelementService,
    private breadCrumbService: BreadCrumbService,
    private userAccessMenuService: UserAccessMenuService,
    private notif: NotificationService,
    private treeviewService: TreeviewService
  ) { }
  ngOnInit() {
    this.role_id = this.data.role_id;
    this.loginArray = [];
    for (const item of this.data.loginArray) {
      if ((Number(this.role_id) === 2 && (item.au_login_id !== '1001' || Number(item.au_login_id) !== 1001))
      || Number(this.role_id) === 3) {
        this.loginArray.push(item);
      }
    }
    this.buildForm();
    this.getProjectList();
    this.homeUrl = this.breadCrumbService.getUrl();

  }
  changeIsWebApp($event) {
    this.moduleArray = [];
    if ($event.value === 'app') {
      this.isApp = true;
      this.typeVal = 'app';
      this.ModuleForm.patchValue({
        pro_id: '',
        login_id: ''
      });
      this.getModuleList('1');
    } else {
      this.typeVal = 'web';
      this.isApp = false;
      this.moduleValues = [];
      this.ModuleForm.patchValue({
        login_id: ''
      });
      this.getModuleList(this.ModuleForm.value.pro_id);
    }
  }
  buildForm() {
    this.ModuleForm = this.fbuild.group({
      login_id: '',
      si_id: '',
      pro_id: ''
    });
    this.ClassModuleForm = this.fbuild.group({
      login_id: '',
    });
  }
  isExistUserAccessMenu(mod_id) {
    return this.userAccessMenuService.isExistUserAccessMenu(mod_id);
  }
  checkIfValueExist(mod_id) {
    const findex = this.finalAssignedModules.indexOf(mod_id);
    if (findex !== -1) {
      return true;
    } else {
      return false;
    }
  }
  setMenuAssignedLevel3($event, item) {
    const findex = this.finalAssignedModules.indexOf(item.mod_id);
    if (findex === -1) {
      this.finalAssignedModules.push(item.mod_id);
    } else {
      this.finalAssignedModules.splice(findex, 1);
    }
  }
  setLevel2($event, item) {
    if (item.submenu_level_2 && item.submenu_level_2.length > 0) {
      for (const submenu of item.submenu_level_2) {
        let mod_id2 = submenu.mod_id;
        const findex2 = this.finalAssignedModules.indexOf(mod_id2);
        if (findex2 === -1) {
          this.finalAssignedModules.push(mod_id2);
        } else {
          this.finalAssignedModules.splice(findex2, 1);
        }
      }
    }
  }
  setMenuAssignedLevel2($event, item) {
    const findex = this.finalAssignedModules.indexOf(item.mod_id);
    if (findex === -1) {
      this.finalAssignedModules.push(item.mod_id);
      if (item.submenu_level_2 && item.submenu_level_2.length > 0) {
        for (const submenu of item.submenu_level_2) {
          let mod_id2 = submenu.mod_id;
          const findex2 = this.finalAssignedModules.indexOf(mod_id2);
          if (findex2 === -1) {
            this.finalAssignedModules.push(mod_id2);
          }
        }
      }

    } else {
      this.finalAssignedModules.splice(findex, 1);
      if (item.submenu_level_2 && item.submenu_level_2.length > 0) {
        for (const submenu of item.submenu_level_2) {
          let mod_id = submenu.mod_id;
          const findex3 = this.finalAssignedModules.indexOf(mod_id);
          if (findex3 !== -1) {
            this.finalAssignedModules.splice(findex3, 1);
          }
        }
      }
    }
  }
  toggleTopMenu(index) {
    this.moduleArray[index].display = this.moduleArray[index].display === 'block' ? 'none' : 'block'
  }
  toggleSubMenu1(index1, index2) {
    this.moduleArray[index1].submenu_level_1[index2].display = this.moduleArray[index1].submenu_level_1[index2].display === 'block' ? 'none' : 'block'
  }
  setMenuAssigned($event, item) {
    // const mod_id = $event.value;
    const findex = this.finalAssignedModules.indexOf(item.mod_id);
    if (findex === -1) {
      this.finalAssignedModules.push(item.mod_id);
      if (item.submenu_level_1 && item.submenu_level_1.length > 0) {
        for (const submenu of item.submenu_level_1) {
          let mod_id2 = submenu.mod_id;
          const findex2 = this.finalAssignedModules.indexOf(mod_id2);
          if (findex2 === -1) {
            this.finalAssignedModules.push(mod_id2);
          }
          this.setLevel2($event, submenu);
        }
      }

    } else {
      this.finalAssignedModules.splice(findex, 1);
      if (item.submenu_level_1 && item.submenu_level_1.length > 0) {
        for (const submenu of item.submenu_level_1) {
          let mod_id = submenu.mod_id;
          const findex3 = this.finalAssignedModules.indexOf(mod_id);
          if (findex3 !== -1) {
            this.finalAssignedModules.splice(findex3, 1);
          }
          this.setLevel2($event, submenu);
        }
      }
    }
  }
  getProjectList() {
    this.adminService.getProjectList({}).subscribe(
      (result: any) => {
        if (result && result.status === 'ok') {
          this.projectBasedMenus = [];
          this.projectsArray = result.data;
          const projectMenus: any[] = [];
          for (const item of this.projectsArray) {
            const obj: any = {};
            obj['project_id'] = item.pro_id;
            obj['project_name'] = item.pro_name;
            obj['project_rights'] = [];
            projectMenus.push(obj);
          }
          this.projectBasedMenus.push(
            { type: 'web', details: projectMenus },
            {
              type: 'app', details: [{
                project_id: '1',
                project_name: 'Mobile',
                project_rights: []
              }]
            },
          );
        }
      });
  }
  getModuleList(val) {
    this.ModuleForm.patchValue({
      login_id: ''
    });
    this.moduleArray = [];
    this.finalAssignedModules = [];
    const pro_id = val;
    this.moduleItems = [];
    this.moduleDivFlag = true;
    if (pro_id) {
      this.adminService.getModuleList({ role_id: this.role_id, pro_id: pro_id, mor_type: !this.isApp ? 'web' : 'app' }).subscribe(
        (result: any) => {
          if (result && result.status === 'ok') {
            this.moduleArray = [];
            this.finalAssignedModules = [];
            for (const item of result.data) {
              item['display'] = 'block';
              if (item.submenu_level_1 && item.submenu_level_1.length > 0) {
                for (const submenu of item.submenu_level_1) {
                  submenu['display'] = 'block';
                  if (submenu.submenu_level_2 && submenu.submenu_level_2.length > 0) {
                    for (const submenu2 of submenu.submenu_level_2) {
                      submenu2['display'] = 'block';
                    }

                  }
                }
              }
              this.moduleArray.push(item);
            }
            let rights_type: any = '';
            if (this.role_id === '2') {
              rights_type = ['school_user_rights'];
            } else {
              rights_type = ['school_teacher_rights'];
            }
            this.common.getGlobalSetting({
              gs_alias: rights_type
            }).subscribe((res2: any) => {
              if (res2 && res2.status === 'ok') {
                this.multiRightsArr = [];
                this.multiRightsArr = JSON.parse(res2.data[0]['gs_value']);
                this.assignedModuleArray = [];
                let modulesAssigned: any[] = [];
                modulesAssigned = this.checkAssignedModulesAsperTypeAndProject();
                if (modulesAssigned && modulesAssigned.length > 0) {
                  for (let i = 0; i < modulesAssigned.length; i++) {
                    const relations: any[] = modulesAssigned[i].split('-');
                    for (let j = 0; j < relations.length; j++) {
                      const findex = this.assignedModuleArray.findIndex(f => Number(f.menu_mod_id) === Number(relations[j]));
                      if (findex === -1) {
                        this.assignedModuleArray.push({
                          menu_mod_id: relations[j],
                          menu_si_id: '',
                          menu_pro_id: this.isApp ? 1 : this.ModuleForm.value.pro_id,
                        });
                      }
                    }
                  }
                  for (const item of this.assignedModuleArray) {
                    this.finalAssignedModules.push(item.menu_mod_id);
                  }
                } else {
                  this.assignedModuleArray = [];
                }
                this.moduleItems = this.treeviewService.getItemData('menu', this.assignedModuleArray, this.moduleArray);
              }
            });
          }
        });
    }

  }
  submitModule() {
    if (this.finalAssignedModules.length > 0 && this.ModuleForm.value.login_id.length > 0) {
      const menuRelation: any = {
        pro_id: this.isApp ? '1' : this.ModuleForm.value.pro_id, menuRelation: this.finalAssignedModules,
        role_id: this.role_id,
        type: this.isApp ? 'app' : 'web',
        login_id: this.ModuleForm.value.login_id
      };
      this.getModulesAsperTypeAndProject();
      this.adminService.addMultipleRights(menuRelation).subscribe(
        (result: any) => {
          if (result && result.status === 'ok') {
            this.notif.showSuccessErrorMessage('Submitted Successfully', 'success');
            this.updateGlobalSetting();
            this.getModuleList(this.isApp ? '1' : this.ModuleForm.value.pro_id);
          }
        });
    } else {
      this.notif.showSuccessErrorMessage('Please select rights and users', 'error');
    }
  }
  closeDialog() {
    this.dialogRef.close();
  }
  updateGlobalSetting() {

    let inputJson = {};
    if (this.role_id === '2') {
      inputJson = {
        'school_user_rights': JSON.stringify(this.multiRightsArr.length > 0 ? this.multiRightsArr : this.projectBasedMenus)
      };
    } else {
      inputJson = {
        'school_teacher_rights': JSON.stringify(this.multiRightsArr.length > 0 ? this.multiRightsArr : this.projectBasedMenus)
      };
    }
    this.common.updateGlobalSetting(inputJson).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.getModuleList(this.isApp ? '1' : this.ModuleForm.value.pro_id);
      } else {
      }
    });
  }
  getModulesAsperTypeAndProject() {
    const findex = this.multiRightsArr.findIndex(f => f.type === this.typeVal);
    if (findex !== -1) {
      const findex2 = this.multiRightsArr[findex]['details'].findIndex(f => Number(f.project_id) === (this.isApp ? 1 : Number(this.ModuleForm.value.pro_id)));
      if (findex2 !== -1) {
        this.multiRightsArr[findex]['details'][findex2]['project_rights'] = this.finalAssignedModules;
      }
    }
  }
  checkAssignedModulesAsperTypeAndProject() {
    const findex = this.multiRightsArr.findIndex(f => f.type === this.typeVal);
    if (findex !== -1) {
      const findex2 = this.multiRightsArr[findex]['details'].findIndex(f => Number(f.project_id) === (this.isApp ? 1 : Number(this.ModuleForm.value.pro_id)));
      if (findex2 !== -1) {
        return this.multiRightsArr[findex]['details'][findex2]['project_rights'];
      }
    }
  }
}
