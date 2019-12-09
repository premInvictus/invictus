import { CirculationManagementModule } from './circulation-management.module';

describe('CirculationManagementModule', () => {
	let circulationManagement: CirculationManagementModule;

	beforeEach(() => {
		circulationManagement = new CirculationManagementModule();
	});

	it('should create an instance', () => {
		expect(circulationManagement).toBeTruthy();
	});
});
