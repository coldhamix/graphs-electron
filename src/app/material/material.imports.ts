import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatInputModule, MatListModule,
  MatToolbarModule } from '@angular/material';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Type } from '@angular/core';

export const materialComponents: Type<any>[] = [
  MatButtonModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatCardModule,
  MatListModule,
  MatIconModule,
  MatDialogModule,
  MatInputModule,
  MatButtonToggleModule
];
