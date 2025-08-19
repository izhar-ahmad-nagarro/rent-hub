import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layouts/components/header/header';
import { AlertComponent } from './shared/components/alert/alert.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, AlertComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'rent-hub';
}
