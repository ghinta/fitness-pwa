import type { BackupService } from '../services/backup-service';
import type { FitnessService } from '../services/fitness-service';

export interface ViewContext {
  fitness: FitnessService;
  backup: BackupService;
  refresh(): Promise<void>;
  setDirty(dirty: boolean): void;
}

export type ViewFactory = (context: ViewContext) => Promise<HTMLElement>;
