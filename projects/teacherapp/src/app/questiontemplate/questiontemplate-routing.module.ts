import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QtemplateComponent } from './qtemplate/qtemplate.component';
import { GenerictemplateComponent } from './generictemplate/generictemplate.component';
import { SpecifictemplateComponent } from './specifictemplate/specifictemplate.component';
import { TemplateListComponent } from './template-list/template-list.component';
import { GenericTemplateListComponent } from './generic-template-list/generic-template-list.component';
import { SpecificTemplateListComponent } from './specific-template-list/specific-template-list.component';
const routes: Routes = [
	{ path: 'question_template', component: QtemplateComponent },
	{ path: 'generictemplate', component: GenerictemplateComponent },
	{ path: 'specifictemplate', component: SpecifictemplateComponent },
	{ path: 'template_list', component: TemplateListComponent },
	{ path: 'generic_template_list', component: GenericTemplateListComponent },
	{ path: 'specific_template_list', component: SpecificTemplateListComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class QuestiontemplateRoutingModule { }
