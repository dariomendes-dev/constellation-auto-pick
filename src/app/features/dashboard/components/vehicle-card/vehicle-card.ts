import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IVehicle } from '../../../../core/models/vehicle.model';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { IColumnConfig } from '../../../../core/constants/configs.const';

@Component({
  selector: 'app-vehicle-card',
  imports: [CommonModule, MatIconModule],
  templateUrl: './vehicle-card.html',
  styleUrl: './vehicle-card.scss',
})
export class VehicleCard {
  @Input() dataSource!: IVehicle[];
  @Input() columnsConfig!: IColumnConfig[];
  @Input() sortData!: { field: string; direction: string };

  @Output() onSort: EventEmitter<string> = new EventEmitter();
  @Output() onFavorite: EventEmitter<{ vehicle: IVehicle; event: Event }> = new EventEmitter();
  @Output() onDetails: EventEmitter<IVehicle> = new EventEmitter();

  sortBy(field: string) {
    this.onSort.emit(field);
  }

  goToDetails(vehicle: IVehicle) {
    this.onDetails.emit(vehicle);
  }

  toggleFavourite(vehicle: IVehicle, event: Event) {
    event.stopPropagation();
    this.onFavorite.emit({ vehicle, event });
  }

  getFieldValue(vehicle: IVehicle, field: string): any {
    return (vehicle as any)[field];
  }
}
