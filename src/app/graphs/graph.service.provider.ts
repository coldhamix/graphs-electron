import { GraphService } from './graph.service';
import { CoordGenerator } from './coord-generator';
import { FactoryProvider } from '@angular/core';

export const graphServiceFactory = () => {
  return new GraphService(new CoordGenerator());
};

export const graphServiceProvider: FactoryProvider = {
  provide: GraphService,
  useFactory: graphServiceFactory,
};
