export interface IVehicle {
  make: string;
  model: string;
  engineSize: string;
  fuel: string;
  year: number;
  mileage: number;
  auctionDateTime: string;
  startingBid: number;
  favourite: boolean;
  details: {
    specification: {
      vehicleType: string;
      colour: string;
      fuel: string;
      transmission: string;
      numberOfDoors: number;
      co2Emissions: string;
      noxEmissions: number;
      numberOfKeys: number;
    };
    ownership: {
      logBook: string;
      numberOfOwners: number;
      dateOfRegistration: string;
    };
    equipment: string[];
  };
}

export interface IVehicleFilters {
  make: string;
  model: string;
  minBid: number;
  maxBid: number;
  favouritesOnly: boolean;
}
