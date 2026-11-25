import { Routes } from '@angular/router';
import { DossierComponent } from './pages/dossier/dossier.component';

export const routes: Routes = [
  { path: '', component: DossierComponent },
  { path: '**', redirectTo: '' },
];
