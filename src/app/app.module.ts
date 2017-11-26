import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import 'polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';

import { AppRoutingModule } from './app-routing.module';

import { ElectronService } from './providers/electron.service';
import { MaterialModule } from './material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SettingsComponent } from './components/settings/settings.component';
import { GraphListComponent } from './components/graph-list/graph-list.component';
import { SettingsService } from './providers/settings.service';
import { TaskRunnerService } from './providers/task-runner.service';
import { HttpClientModule } from '@angular/common/http';
import { GraphRendererModule } from 'app/graph-renderer/graph-renderer.module';
import { graphServiceProvider } from 'app/graph-renderer/graph-service/graph.service.provider';
import { GraphNodeSelectorComponent } from './components/graph-node-selector/graph-node-selector.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SettingsComponent,
    GraphListComponent,
    GraphNodeSelectorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    // GraphsModule,
    GraphRendererModule,
    MaterialModule,
    AppRoutingModule
  ],
  providers: [
    ElectronService,
    SettingsService,
    TaskRunnerService,
    graphServiceProvider
  ],
  bootstrap: [AppComponent],
  entryComponents: [SettingsComponent]
})
export class AppModule { }
