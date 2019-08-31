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
	}

	buildForm() {
		this.classForm = this.fbuild.group({
			classFromArray: this.fbuild.array([])
		});
	}
	get classFormArray() {
		return this.classForm.get('classFromArray') as FormArray;
	}
	addClassFormArray(gclass_id, gclass_name, class_id) {
		this.classFormArray.push(
			this.fbuild.group({
				gclass_id: gclass_id,
				gclass_name: gclass_name,
				class_id: class_id
			})
		);
	}
	getGClass() {
		this.gcArray = [];
		this.smartService.getClass({ class_status: 1 }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.gcArray = result.data;
				if (this.gcArray.length > 0) {
					this.gcArray.forEach(element => {
						this.addClassFormArray(element.class_id, element.class_name, '');
					});
					this.getSmartToAxiom();
				}
			}
		});
	}
	getClass() {
		this.cArray = [];
		this.axiomService.getClass({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.cArray = result.data;
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
							if (element1.gclass_id === element.tgam_global_config_id) {
								element1.class_id = element.tgam_axiom_config_id.split(',');
							}
						});
						patchdata.push(element1);
					}
					this.classForm.reset();
					const items = this.classFormArray;
					for (let i = 0; i < patchdata.length; i++) {
						items.at(i).patchValue({
							gclass_id: patchdata[i].gclass_id,
							gclass_name: patchdata[i].gclass_name,
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
