import { EmployeeMasterModule } from './employee-master.module';

describe('EmployeeMasterModule', () => {
	let EmployeeMasterModule: EmployeeMasterModule;

	beforeEach(() => {
		EmployeeMasterModule = new EmployeeMasterModule();
	});

	it('should create an instance', () => {
		expect(EmployeeMasterModule).toBeTruthy();
	});
});
