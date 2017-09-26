import {
  MdButtonModule, MdCardModule, MdCheckboxModule, MdDialogModule, MdIconModule, MdInputModule, MdListModule,
  MdToolbarModule,
} from '@angular/material';
import { Type } from '@angular/core';

export const materialComponents: Type<any>[] = [
  MdButtonModule,
  MdCheckboxModule,
  MdToolbarModule,
  MdCardModule,
  MdListModule,
  MdIconModule,
  MdDialogModule,
  MdInputModule
];
