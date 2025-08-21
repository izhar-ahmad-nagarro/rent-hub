// services/db-init.service.ts
import { Injectable } from '@angular/core';
import { db } from '../../db/app.db';

@Injectable({ providedIn: 'root' })
export class DBInitService {
  private dbReadyPromise: Promise<void>;

  constructor() {
    this.dbReadyPromise = this.initializeDatabase();
  }

  private async initializeDatabase(): Promise<void> {
    try {
      await db.open(); // Waits for IndexedDB to open and populate (if first time)
      console.log('[DBInitService] IndexedDB is ready.');
    } catch (error) {
      console.error('[DBInitService] Failed to open IndexedDB:', error);
    }
  }

  /** Call this in any component to wait for DB readiness */
  public whenReady(): Promise<void> {
    return this.dbReadyPromise;
  }
}
