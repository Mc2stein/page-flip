import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import 'zone.js';
import { AppFlip } from './app-flip.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppFlip],
  template: `
    <app-flip></app-flip>
  `,
})
export class App {}

bootstrapApplication(App);
