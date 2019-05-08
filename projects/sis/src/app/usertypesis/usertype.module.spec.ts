import { UsertypeSisModule } from './usertypesis.module';

describe('UsertypeSisModule', () => {
	let usertypeModule: UsertypeSisModule;

	beforeEach(() => {
		usertypeModule = new UsertypeSisModule();
	});

	it('should create an instance', () => {
		expect(usertypeModule).toBeTruthy();
	});
});
