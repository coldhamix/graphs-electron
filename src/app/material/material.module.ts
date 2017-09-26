import { NgModule } from '@angular/core';
import { materialComponents as components } from './material.imports';

@NgModule({
  imports: components,
  exports: components
})
export class MaterialModule { }
