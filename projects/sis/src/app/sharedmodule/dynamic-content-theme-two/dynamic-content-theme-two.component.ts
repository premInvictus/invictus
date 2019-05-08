import {
	Component, Input, OnChanges, OnInit, OnDestroy,
	ViewChild, ViewContainerRef,
	ComponentFactoryResolver, ComponentRef
} from '@angular/core';
import { StudentFormConfigTwoService } from './student-form-config-two.service';
import { DynamicComponent } from '../dynamiccomponent';
import { ProcesstypeService } from '../../_services/index';

@Component({
	selector: 'app-dynamic-content-theme-two',
	templateUrl: './dynamic-content-theme-two.component.html',
	styleUrls: ['./dynamic-content-theme-two.component.scss']
})
export class DynamicContentThemeTwoComponent implements OnInit, OnDestroy, OnChanges {

	@ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;

	@Input() type: string;
	@Input() studentdetails: any;
	@Input() belongToForm: string;
	@Input() config: any;
	@Input() currentStudentDataId: any;
	@Input() configSetting: any;

	private componentRef: ComponentRef<{}>;
	private mappings: any = {};

	constructor(private processtypeService: ProcesstypeService,
		private componentFactoryResolver: ComponentFactoryResolver, private studentFormConfigService: StudentFormConfigTwoService) { }

	getComponentType(typeName: string) {
		const type = this.mappings[typeName];
		return type;
	}

	ngOnInit() {
		this.mappings = this.studentFormConfigService.mappings;
		if (this.type) {
			const componentType = this.getComponentType(this.type);
			const factory = this.componentFactoryResolver.resolveComponentFactory(componentType);
			this.componentRef = this.container.createComponent(factory);

			// set component context
			const instance = <DynamicComponent>this.componentRef.instance;
			this.processtypeService.setProcesstype(this.studentFormConfigService.processType[this.belongToForm]);
			instance.context = {
				studentdetails: this.studentdetails,
				config: this.config,
				belongToForm: this.belongToForm,
				processType: this.studentFormConfigService.processType[this.belongToForm],
				configSetting: this.configSetting
			};
		}
	}

	ngOnDestroy() {
		if (this.componentRef) {
			this.componentRef.destroy();
			this.componentRef = null;
		}
	}

	doSomething(value) {
	}

	ngOnChanges() {
	}

}
