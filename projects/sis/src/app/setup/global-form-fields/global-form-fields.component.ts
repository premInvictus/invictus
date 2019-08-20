import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, FormControl, FormGroupDirective } from '@angular/forms';
import { SisService, CommonAPIService } from '../../_services';
import { ErrorStateMatcher, MatTableDataSource } from '@angular/material';
import { ConfigSLCElement } from './config.model';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
@Component({
	selector: 'app-global-form-fields',
	templateUrl: './global-form-fields.component.html',
	styleUrls: ['./global-form-fields.component.scss']
})
export class GlobalFormFieldsComponent implements OnInit {
	confirmValidParentMatcher = new ConfirmValidParentMatcher();
	showFormFieldSetup = false;
	labelForm: FormGroup;
	currentIndex: any;
	configArray: any[] = [];
	typeFlag = false;
	prefetchFlag = false;
	updateFlag = false;
	checkRequire = false;
	mappedFlag = false;
	formfields: any[] = [];
	displayedColumns: any[] = ['position', 'field_label', 'field_type', 'field_mapped', 'action'];
	displayedColumns2: any[] = ['select', 'field_label', 'field_type', 'field_mapped'];
	CONFIG_ELEMENT_DATA: ConfigSLCElement[] = [];
	mappedArray: any[] = [];
	configDataSource = new MatTableDataSource<ConfigSLCElement>(this.CONFIG_ELEMENT_DATA);
	typeArray: any[] = [{
		tmap_usts_id: '1',
		tmap_usts_type: 'SLC'
	},
	{
		tmap_usts_id: '2',
		tmap_usts_type: 'Certificate'
	},
	{
		tmap_usts_id: '3',
		tmap_usts_type: 'Admit Card'
	},
	{
		tmap_usts_id: '4',
		tmap_usts_type: 'Acknowledgement'
	}];
	type_id: any;
	constructor(private fbuild: FormBuilder,
		private sisService: SisService,
		private common: CommonAPIService) { }

	ngOnInit() {
		this.buildForm();
		this.getFormFields();
	}
	buildForm() {
		this.labelForm = this.fbuild.group({
			sff_id: '',
			sff_field_tag: '',
			sff_label: '',
			sff_field_name: '',
			sff_ff_id: '',
			sff_field_type: ''
		});
	}
	getFormFields() {
		this.formfields = [];
		this.sisService.getFormFieldsForFilter({
			ff_custom_status: 'Y'
		}).subscribe((result: any) => {
			if (result.status === 'ok') {
				for (const item of result.data) {
					if (Number(item.ff_tb_id) < 12) {
						this.formfields.push(item);
					}
				}
				this.getSLCTCFormConfig();
			}
		});
	}
	enableSetupDiv($event) {
		if ($event.value === '1') {
			this.showFormFieldSetup = true;
			this.mappedFlag = false;
		} else {
			this.showFormFieldSetup = false;
			this.mappedFlag = true;
		}
	}
	addNew() {
		if (!this.labelForm.value.sff_field_type) {
			this.typeFlag = true;
		}
		if (this.labelForm.valid) {
			this.typeFlag = false;
			if (this.prefetchFlag === true) {
				this.labelForm.value.sff_field_tag = this.getFieldName2(this.labelForm.value.sff_ff_id);
			}
			const findex = this.configArray.findIndex(f => f.sff_ff_id === this.labelForm.value.sff_ff_id);
			if (findex === -1) {
				this.configArray.push(this.labelForm.value);
				this.common.showSuccessErrorMessage('Added Successfully', 'success');
			} else {
				this.common.showSuccessErrorMessage('Duplicate Entry not allowed for prefetch type', 'error');
			}
			this.getConfigElementData(this.configArray);
		}
	}
	getConfigElementData(array: any) {
		this.CONFIG_ELEMENT_DATA = [];
		this.configDataSource = new MatTableDataSource<ConfigSLCElement>(this.CONFIG_ELEMENT_DATA);
		let pos = 1;
		for (const item of array) {
			this.CONFIG_ELEMENT_DATA.push({
				position: pos,
				field_label: item.sff_label,
				field_type: item.sff_field_type,
				field_mapped: this.getFieldName(item.sff_ff_id),
				field_id: item.sff_id,
				action: item
			});
			pos++;
		}
		this.configDataSource = new MatTableDataSource<ConfigSLCElement>(this.CONFIG_ELEMENT_DATA);
	}
	getPrefetchCustom($event) {
		this.typeFlag = false;
		if ($event.value === 'prefetch') {
			this.prefetchFlag = true;
			this.checkRequire = true;
		} else {
			this.prefetchFlag = false;
			this.checkRequire = false;
		}
	}
	getFieldName(f_id) {
		const findex = this.formfields.findIndex(f => f.ff_id === f_id);
		if (findex !== -1) {
			return this.formfields[findex].ff_label;
		}
	}
	getFieldName2(f_id) {
		const findex = this.formfields.findIndex(f => f.ff_id === f_id);
		if (findex !== -1) {
			return this.formfields[findex].ff_field_name;
		}
	}
	delete(index) {
		this.configArray.splice(index - 1, 1);
		this.getConfigElementData(this.configArray);
		this.common.showSuccessErrorMessage('Deleted Successfully', 'success');
	}
	edit(item, index) {
		this.currentIndex = '';
		this.labelForm.patchValue({
			sff_label: item.sff_label,
			sff_ff_id: this.configArray[index - 1].sff_ff_id,
			sff_field_type: item.sff_field_type
		});
		this.currentIndex = index - 1;
		this.updateFlag = true;
	}
	update() {
		if (!this.labelForm.value.sff_field_type) {
			this.typeFlag = true;
		}
		if (this.labelForm.valid) {
			this.typeFlag = false;
			this.configArray[this.currentIndex] = this.labelForm.value;
			this.getConfigElementData(this.configArray);
			this.updateFlag = false;
			this.common.showSuccessErrorMessage('Updated Successfully', 'success');
		}
	}
	insertCustom() {
		const customJson = {
			configRelation: this.configArray
		};
		this.sisService.insertSlcTcFormConfig(customJson).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.common.showSuccessErrorMessage('Custom fields Added', 'success');
				this.getSLCTCFormConfig();
			}
		});
	}
	getSLCTCFormConfig() {
		this.configArray = [];
		this.sisService.getSlcTcFormConfig({}).subscribe((result: any) => {
			if (result.status === 'ok') {
				for (const item of result.data) {
					this.configArray.push({
						sff_label: item.sff_label,
						sff_ff_id: item.sff_ff_id,
						sff_id: item.sff_id,
						sff_field_tag: item.sff_field_tag,
						sff_field_type: item.sff_field_type
					});
				}
				this.getConfigElementData(this.configArray);
			}
		});
	}
	getMappedFields(f_id) {
		const findex = this.mappedArray.findIndex(f => f.tmap_sff_id === f_id);
		if (findex === -1) {
			this.mappedArray.push({ tmap_sff_id: f_id });
		} else {
			this.mappedArray.splice(findex, 1);
		}
	}
	setId($event) {
		this.mappedArray = [];
		this.type_id = $event.value;
		this.sisService.getSlcTcFormConfig({ tmap_usts_id: this.type_id }).subscribe((result: any) => {
			if (result.status === 'ok') {
				for (const item of result.data) {
					this.mappedArray.push({ tmap_sff_id: item.sff_id });
				}
			}
		});
	}
	checkMappedFields(f_id) {
		const findex = this.mappedArray.findIndex(f => f.tmap_sff_id === f_id);
		if (findex !== -1) {
			return true;
		} else {
			return false;
		}
	}
	insertMappedFields() {
		const configJSON = {
			configRelation: this.mappedArray,
			tmap_usts_id: this.type_id
		};
		this.sisService.insertTemplateMapping(configJSON).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.common.showSuccessErrorMessage('Mapped Successfully', 'success');
				this.mappedArray = [];
				this.sisService.getSlcTcFormConfig({ tmap_usts_id: this.type_id }).subscribe((result2: any) => {
					if (result2.status === 'ok') {
						for (const item of result2.data) {
							this.mappedArray.push({ tmap_sff_id: item.sff_id });
						}
					}
				});
			}
		});
	}
}
// export class ConfirmValidParentMatcher implements ErrorStateMatcher {
// 	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
// 		return control && control.invalid && (control.dirty || control.touched || form.submitted);
// 	}
// }
