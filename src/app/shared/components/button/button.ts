import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, input, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrl: './button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Button {
  @Input() label: string = '';
  @Input() variant: string = 'primary'; // e.g. 'primary', 'outline-success'
  @Input() size: 'sm' | 'lg' | '' = ''; // Bootstrap sizes
  @Input() block: boolean = false; // Full width
  @Input() icon: string = ''; // Font Awesome or Bootstrap icon class
  disabled = input<boolean>(false);
  // disabled: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() btnClasses: Array<string> = [];

  @Output() clicked = new EventEmitter<Event>();

  get classes(): string[] {
    const base = [`btn`, `btn-${this.variant}`];
    if (this.size) base.push(`btn-${this.size}`);
    if (this.block) base.push('w-100');
    base.push(...this.btnClasses)
    return base;
  }

  handleClick(event: Event) {
    if (!this.disabled()) {
      this.clicked.emit(event);
    }
  }
}


