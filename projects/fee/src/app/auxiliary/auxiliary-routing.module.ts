import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChequeControlToolComponent } from './cheque-control-tool/cheque-control-tool.component';
import { EditRequestsComponent } from './edit-requests/edit-requests.component';
import { ConcessionRectificationComponent } from './concession-rectification/concession-rectification.component';
import { FamilywiseFeeRecieptComponent } from './familywise-fee-reciept/familywise-fee-reciept.component';
import { AddFamilyComponent } from './add-family/add-family.component';


const routes: Routes = [
	{ path: 'cheque-control-tool', component: ChequeControlToolComponent },
	{path:  'edit-requests', component: EditRequestsComponent},
	{path:  'concession-rectification', component: ConcessionRectificationComponent},
	{ path: 'familywise-fee-reciept', component: FamilywiseFeeRecieptComponent},
	{ path: 'add-family', component: AddFamilyComponent},
	{ path: 'familywise-fee-receipt', component: FamilywiseFeeRecieptComponent}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AuxiliaryRoutingModule { }
