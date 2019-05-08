import {
	Component, Input, OnChanges, OnInit,
	OnDestroy, ViewChild, ViewContainerRef,
	ComponentFactoryResolver, ComponentRef
} from '@angular/core';
import { StudentFormConfigService } from './student-form-config.service';
import { DynamicComponent } from '../dynamiccomponent';
import { ProcesstypeService } from '../../_services/index';

@Component({
	selector: 'app-dynamic-content',
	templateUrl: './dynamic-content.component.html',
	styleUrls: ['./dynamic-content.component.scss']
})
export class DynamicContentComponent implements OnInit, OnDestroy, OnChanges {

	@ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;

	@Input() type: string;
	@Input() studentdetails: any;
	@Input() belongToForm: string;
	@Input() config: any;
	@Input() currentStudentDataId: any;

	private componentRef: ComponentRef<{}>;
	private mappings: any = {};

	constructor(private processtypeService: ProcesstypeService,
		private componentFactoryResolver: ComponentFactoryResolver, private studentFormConfigService: StudentFormConfigService) { }

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
				processType: this.studentFormConfigService.processType[this.belongToForm]
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

