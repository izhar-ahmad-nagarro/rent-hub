import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../services/alert.service';

export interface IAlert {
  type: string;
  message: string;
  id: number;
}

@Component({
  selector: 'app-alert',
  imports: [NgbAlertModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  alertService = inject(AlertService);
  alerts = this.alertService.alerts;

  constructor() {
    this.reset();
  }

  close(alert: IAlert) {
    this.alertService.dismiss(alert.id)
  }

  reset() {
    this.alertService.clearAll();
  }
}
