import { StudentMasterThemeTwoModule } from './student-master-theme-two.module';

describe('StudentMasterThemeTwoModule', () => {
	let studentMasterThemeTwoModule: StudentMasterThemeTwoModule;

	beforeEach(() => {
		studentMasterThemeTwoModule = new StudentMasterThemeTwoModule();
	});

	it('should create an instance', () => {
		expect(studentMasterThemeTwoModule).toBeTruthy();
	});
});
