import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GraphComponent } from './graph.component';
import { graphServiceProvider } from './graph.service.provider';

@NgModule({
  imports: [BrowserModule],
  declarations: [ GraphComponent ],
  exports: [ GraphComponent ],
  providers: [ graphServiceProvider ],
})
export class GraphsModule {
}
