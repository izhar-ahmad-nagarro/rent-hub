import { Injectable, signal } from '@angular/core';
import { IAlert } from '../components/alert/alert.component';

export type AlertType = 'success' | 'error' | 'info' | 'warning';
@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private alertsSignal = signal<IAlert[]>([]);
  readonly alerts = this.alertsSignal.asReadonly();

  private idCounter = 0;

  show(type: AlertType, message: string) {
    const id = ++this.idCounter;

    const newAlert: IAlert = { id, type, message };
    this.alertsSignal.update((alerts) => [...alerts, newAlert]);

    setTimeout(() => this.dismiss(id), 5000);
  }

  success(msg: string) {
    this.show('success', msg);
  }

  error(msg: string) {
    this.show('error', msg);
  }

  info(msg: string) {
    this.show('info', msg);
  }

  warning(msg: string) {
    this.show('warning', msg);
  }

  dismiss(id: number) {
    this.alertsSignal.update((alerts) => alerts.filter((a) => a.id !== id));
  }

  clearAll() {
    this.alertsSignal.set([]);
  }
}
