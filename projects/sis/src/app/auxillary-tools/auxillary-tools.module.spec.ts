import { AuxillaryToolsModule } from './auxillary-tools.module';

describe('AuxillaryToolsModule', () => {
	let auxillaryToolsModule: AuxillaryToolsModule;

	beforeEach(() => {
		auxillaryToolsModule = new AuxillaryToolsModule();
	});

	it('should create an instance', () => {
		expect(auxillaryToolsModule).toBeTruthy();
	});
});
