import { Component, OnInit } from '@angular/core';
import { AxiomService, SisService, SmartService, CommonAPIService } from '../../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
	selector: 'app-class-map',
	templateUrl: './class-map.component.html',
	styleUrls: ['./class-map.component.css']
})
export class ClassMapComponent implements OnInit {

	classForm: FormGroup;
	gcArray: any[] = [];
	cArray: any[] = [];
	gacArray: any[] = [];
	gsecArray: any[] = [];
	gsecValueArray: any[] = [];
	classflag = false;
	constructor(
		private fbuild: FormBuilder,
		private axiomService: AxiomService,
		private sisService: SisService,
		private smartService: SmartService,
		private commonAPIService: CommonAPIService,
	) { }

	ngOnInit() {
		this.buildForm();
		this.getGClass();
		this.getClass();
		this.getGSection()
	}

	buildForm() {
		this.classForm = this.fbuild.group({
			classFromArray: this.fbuild.array([])
		});
	}
	get classFormArray() {
		return this.classForm.get('classFromArray') as FormArray;
	}
	addClassFormArray(gclass_id, class_name, class_id) {
		this.classFormArray.push(
			this.fbuild.group({
				gclass_id: gclass_id,
				gsec_id: '',
				class_name: class_name,
				class_id: class_id
			})
		);
	}
	getGSection() {
		this.gsecArray = [];
		this.smartService.getSection({ sec_status: 1 }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.gsecArray = result.data;
				this.gsecArray.forEach(element => {
					this.gsecValueArray.push(element.sec_id);
				});
				console.log(this.gsecValueArray);
			}
		})
	}
	getGClass() {
		this.gcArray = [];
		this.smartService.getClass({ class_status: 1 }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.gcArray = result.data;
			}
		});
	}
	getClass() {
		this.cArray = [];
		this.axiomService.getClass({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.cArray = result.data;
				this.classflag = true;
				if (this.cArray.length > 0) {
					this.cArray.forEach(element => {
						this.addClassFormArray('', element.class_name, element.class_id);
					});
					this.getSmartToAxiom();
				}
			}
		});
	}
	getSmartToAxiom() {
		this.gacArray = [];
		this.smartService.getSmartToAxiom({ tgam_config_type: '1' }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.gacArray = result.data;
				if (this.gacArray.length > 0) {
					const patchdata = [];
					for (const element1 of this.classFormArray.value) {
						this.gacArray.forEach(element => {
							if (element1.class_id === element.tgam_axiom_config_id) {
								element1.gclass_id = element.tgam_global_config_id;
								element1.gsec_id = element.tgam_global_sec_id.split(',');
							}
						});
						patchdata.push(element1);
					}
					this.classForm.reset();
					const items = this.classFormArray;
					for (let i = 0; i < patchdata.length; i++) {
						items.at(i).patchValue({
							gclass_id: patchdata[i].gclass_id,
							gsec_id: patchdata[i].gsec_id,
							class_name: patchdata[i].class_name,
							class_id: patchdata[i].class_id
						});
					}
					this.classflag = true;
				}
			} else {
				this.classflag = true;
			}
		});
	}

	submitClass() {
		console.log(this.classForm.value);
		const param: any = {};
		param.mapclassArr = this.classForm.value;
		param.tgam_config_type = '1';
		this.smartService.addSmartToAxiom(param).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
			}
		});
	}


}
