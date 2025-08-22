import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layouts/components/header/header.component';
import { AlertComponent } from './shared/components/alert/alert.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, AlertComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'rent-hub';
}
