import { IVehicle } from '../models/vehicle.model';
import { VehicleService } from './vehicle.service';

describe('VehicleService', () => {
  let service: VehicleService;
  const vehicles: IVehicle[] = [
    {
      make: 'Toyota',
      model: 'Yaris',
      startingBid: 1000,
      favourite: true,
      engineSize: '',
      fuel: '',
      year: 2012,
      mileage: 120000,
      auctionDateTime: '',
      details: {} as any,
    },
    {
      make: 'Honda',
      model: 'Civic',
      startingBid: 800,
      favourite: false,
      engineSize: '',
      fuel: '',
      year: 2015,
      mileage: 90000,
      auctionDateTime: '',
      details: {} as any,
    },
    {
      make: 'Ford',
      model: 'Focus',
      startingBid: 1200,
      favourite: false,
      engineSize: '',
      fuel: '',
      year: 2010,
      mileage: 150000,
      auctionDateTime: '',
      details: {} as any,
    },
  ];

  beforeEach(() => {
    service = new VehicleService({} as any);
  });

  it('should filter vehicles by make and favourite', () => {
    const filters = {
      make: 'Toyota',
      model: '',
      minBid: 0,
      maxBid: 10000,
      favouritesOnly: true,
    };

    const result = service.filterVehicles(vehicles, filters);
    expect(result.length).toBe(1);
    expect(result[0].make).toBe('Toyota');
  });

  describe('sortVehicles', () => {
    it('should sort by year ascending', () => {
      const sorted = service.sortVehicles(vehicles, {
        field: 'year',
        direction: 'asc',
      });
      expect(sorted[0].year).toBe(2010);
      expect(sorted[1].year).toBe(2012);
      expect(sorted[2].year).toBe(2015);
    });

    it('should sort by year descending', () => {
      const sorted = service.sortVehicles(vehicles, {
        field: 'year',
        direction: 'desc',
      });
      expect(sorted[0].year).toBe(2015);
      expect(sorted[1].year).toBe(2012);
      expect(sorted[2].year).toBe(2010);
    });

    it('should return unsorted data if field is empty', () => {
      const sorted = service.sortVehicles(vehicles, {
        field: '',
        direction: 'asc',
      });
      expect(sorted).toEqual(vehicles); // same order
    });
  });
});
