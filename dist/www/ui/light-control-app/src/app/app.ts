import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LightControl } from './components/light-control/light-control';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LightControl],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Home Assistant Light Control');
}
