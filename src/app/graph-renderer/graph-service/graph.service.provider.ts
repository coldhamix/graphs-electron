import { GraphService } from './graph.service';
import { CoordGenerator } from '../coord-generator/coord-generator';

export let grapthServiceFactory = () => {
	return new GraphService(new CoordGenerator());
}

export let graphServiceProvider = {
	provide: GraphService,
	useFactory: grapthServiceFactory
}