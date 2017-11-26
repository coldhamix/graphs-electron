import { Injectable } from '@angular/core';
import { Plugin } from '../model/plugin';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, remote } from 'electron';
import * as fs from 'fs';
import * as childProcess from 'child_process';
import * as canvasBuffer from 'electron-canvas-to-buffer';
import { Plugins } from 'app/model/plugins';

@Injectable()
export class ElectronService {

  ipcRenderer: typeof ipcRenderer;
  childProcess: typeof childProcess;
  remote: typeof remote;
  fs: typeof fs;
  canvasBuffer: typeof canvasBuffer;

  constructor() {
    // Conditional imports
    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.childProcess = window.require('child_process');
      this.remote = window.require('electron').remote;
      this.fs = window.require('fs');
      this.canvasBuffer = window.require('electron-canvas-to-buffer');
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  };

  createResultDir(plugin: Plugin): string {

    if (!this.fs.existsSync('result')) {
      this.fs.mkdirSync('result');
    }

    const pluginDir = `result/${plugin.name}`;
    this.clearDir(pluginDir);
    this.fs.mkdirSync(pluginDir);

    return pluginDir;
  }

  clearDir(path: string): void {
    let files = [];
    if (this.fs.existsSync(path) ) {
      files = this.fs.readdirSync(path);
      files.forEach((file, index) => {
        const curPath = `${path}/${file}`;
        if (this.fs.lstatSync(curPath).isDirectory()) {
          this.clearDir(curPath);
        } else {
          this.fs.unlinkSync(curPath);
        }
      });
      this.fs.rmdirSync(path);
    }
  }

  findCwdPlugins(): Plugins {
    const cwd = { plugins: [] };
    const suffix = '.plugin.js';
    if (this.isElectron()) {
      const files = this.fs.readdirSync('.');
      for (let file of files) {
        if (file.endsWith(suffix)) {
          cwd.plugins.push(<Plugin> {
            name: file.substring(0, suffix.length - 1),
            description: 'Режим разработки: задание из текущей директории',
            caption: file,
            external: true
          });
        }
      }
    }

    console.log(cwd);

    return cwd;    
  }

  readFile(fileName: string): string {
    if (this.isElectron()) {
      return this.fs.readFileSync(`./${fileName}`, 'utf-8');
    }
    return '';
  }

  saveImageFile(name: string, canvas: HTMLCanvasElement): void {
    const buffer = this.canvasBuffer(canvas, 'image/png');
    try {
      this.fs.writeFileSync(name, buffer);
      console.log('Successfully wrote to ' + name);
    } catch (e) {
      console.error('Failed writing to file', e);
    }
  }

  saveTextFile(name: string, contents: string): void {
    try {
      this.fs.writeFileSync(name, contents, { encoding: 'utf-8' });
      console.log('Successfully wrote to ' + name);
    } catch (e) {
      console.error('Failed writing to file', e);
    }
  }

}
