import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  readonly searchTerm = signal('');
  readonly debouncedSearch = signal('');

  private debounceTimeout: any;

  constructor() {
    effect(() => {
      const value = this.searchTerm();
      console.log('serach', value)
      // Clear previous timeout
      clearTimeout(this.debounceTimeout);

      // Start new debounce timer
      this.debounceTimeout = setTimeout(() => {
        this.debouncedSearch.set(value);
      }, 300);
    });
  }

}
