import { Component } from '@angular/core';
import { AnnotatorComponent } from './annotator/annotator.component';

@Component({
  selector: 'app-root',
  imports: [AnnotatorComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
