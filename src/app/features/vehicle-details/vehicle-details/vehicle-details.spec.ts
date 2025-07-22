import { VehicleDetails } from './vehicle-details';
import { VehicleService } from '../../../core/services/vehicle.service';
import { ViewStateService } from '../../../core/services/view-state.service';
import { IVehicle } from '../../../core/models/vehicle.model';
import { Router } from '@angular/router';

describe('VehicleDetails', () => {
  let component: VehicleDetails;
  let vehicleService: VehicleService;

  beforeEach(() => {
    vehicleService = new VehicleService({} as any);
    component = new VehicleDetails(
      {} as Router,
      vehicleService,
      new ViewStateService(),
    );
  });

  it('should call toggleFavourite on VehicleService and update favourite', () => {
    const vehicle: IVehicle = {
      make: 'Toyota',
      model: 'Yaris',
      startingBid: 5000,
      favourite: true,
      engineSize: '',
      fuel: '',
      year: 0,
      mileage: 0,
      auctionDateTime: '',
      details: {} as any,
    };
    component.vehicle = vehicle;

    // create a spy on vehicleService to check the toggleFavourite
    const toggleSpy = spyOn(vehicleService, 'toggleFavourite');
    component.toggleFavourite();

    expect(toggleSpy).toHaveBeenCalledWith(vehicle);
    expect(component.vehicle.favourite).toBe(false);
  });
});
