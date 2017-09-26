import { Injectable } from '@angular/core';

@Injectable()
export class SettingsService {

  private _printTaskDescription: boolean;

  get printTaskDescription(): boolean {
    return this._printTaskDescription;
  }

  set printTaskDescription(value: boolean) {
    this._printTaskDescription = value;
  }
}
