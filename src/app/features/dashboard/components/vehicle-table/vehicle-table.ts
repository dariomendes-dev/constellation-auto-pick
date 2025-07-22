import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { IVehicle } from '../../../../core/models/vehicle.model';
import { CommonModule } from '@angular/common';
import { IColumnConfig } from '../../../../core/constants/configs.const';

@Component({
  selector: 'app-vehicle-table',
  imports: [CommonModule, MatIconModule, MatTableModule],
  templateUrl: './vehicle-table.html',
  styleUrl: './vehicle-table.scss',
})
export class VehicleTable {
  @Input() dataSource!: IVehicle[];
  @Input() columnsConfig!: IColumnConfig[];
  @Input() columnFields!: string[];
  @Input() sortData!: { field: string; direction: string };

  @Output() onSort: EventEmitter<string> = new EventEmitter();
  @Output() onFavorite: EventEmitter<{ vehicle: IVehicle; event: Event }> = new EventEmitter();
  @Output() onDetails: EventEmitter<IVehicle> = new EventEmitter();

  sortBy(field: string) {
    this.onSort.emit(field);
  }

  goToDetails(row: IVehicle) {
    this.onDetails.emit(row);
  }

  toggleFavourite(vehicle: IVehicle, event: Event) {
    this.onFavorite.emit({ vehicle, event });
  }
}
