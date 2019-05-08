import { AdmissionToolsModule } from './admission-tools.module';

describe('AdmissionToolsModule', () => {
	let admissionToolsModule: AdmissionToolsModule;

	beforeEach(() => {
		admissionToolsModule = new AdmissionToolsModule();
	});

	it('should create an instance', () => {
		expect(admissionToolsModule).toBeTruthy();
	});
});
