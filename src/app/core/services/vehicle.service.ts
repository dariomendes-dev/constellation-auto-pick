import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IVehicle } from '../models/vehicle.model';
import { Observable } from 'rxjs';
import { IFilters } from './view-state.service';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  vehicleData: IVehicle[] = [];
  selectedVehicle!: IVehicle;

  minAvailableBid = 0;
  maxAvailableBid = 0;

  constructor(private http: HttpClient) {}

  getVehicles(): Observable<IVehicle[]> {
    return this.http.get<IVehicle[]>('/assets/data/vehicles_dataset.json');
  }

  setMinMaxBids(): void {
    const bids = this.vehicleData.map((v) => v.startingBid);
    this.minAvailableBid = Math.min(...bids);
    this.maxAvailableBid = Math.max(...bids);
  }

  getUniqueMakes(): string[] {
    return [...new Set(this.vehicleData.map((v) => v.make))].sort();
  }

  getModelsByMake(make: string): string[] {
    return make ? [...new Set(this.vehicleData.filter((v) => v.make === make).map((v) => v.model))].sort() : [];
  }

  /**
   * Filters vehicles based on filter object
   * @param data vehicles data array
   * @param filters current selected filters object
   * @returns filtered array
   */
  filterVehicles(data: IVehicle[], filters: IFilters): IVehicle[] {
    return data.filter((v) => {
      const matchesMake = !filters.make || v.make === filters.make;
      const matchesModel = !filters.model || v.model === filters.model;
      const matchesBid = v.startingBid >= filters.minBid && v.startingBid <= filters.maxBid;
      const matchesFav = !filters.favouritesOnly || v.favourite;
      return matchesMake && matchesModel && matchesBid && matchesFav;
    });
  }

  /**
   * Sorts the vehicles data based on current sort settings 
   * @param data vehicles data array
   * @param sort sort settings object
   * @returns sorted vehicles data array
   */
  sortVehicles(data: IVehicle[], sort: { field: string; direction: 'asc' | 'desc' }): IVehicle[] {
    if (!sort.field) return [...data];

    return [...data].sort((a, b) => {
      const aVal = (a as any)[sort.field];
      const bVal = (b as any)[sort.field];
      const compare = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sort.direction === 'asc' ? compare : -compare;
    });
  }

  toggleFavourite(vehicle: IVehicle): void {
    this.vehicleData = this.vehicleData.map((v) => (v === vehicle ? { ...v, favourite: !v.favourite } : v));
  }
}
