import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard/dashboard';
import { VehicleDetails } from './features/vehicle-details/vehicle-details/vehicle-details';

export const routes: Routes = [
  {
    path: '',
    component: Dashboard,
  },
  {
    path: 'vehicle-details',
    component: VehicleDetails,
  },
];
