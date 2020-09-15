import {Injectable} from '@angular/core';

@Injectable()
export class RoutingStateService {
		public routingState: any[] = [];
		// {RouterLink:'', RouterState: []}
		constructor() {

		}
		setRoutingState(link, states) {
				const linki = this.routingState.findIndex(value => value.RouterLink === link);
				if (linki !== -1) {
						this.routingState[linki] = {RouterLink: link, RouterState: states};
				} else {
						this.routingState.push({RouterLink: link, RouterState: states});
				}
				console.log(this.routingState);
		}
		getRoutingState(link) {
				const linki = this.routingState.findIndex(value => value.RouterLink === link);
				if (linki !== -1) {
						return this.routingState[linki];
				} else {
						return null;
				}
		}
}
