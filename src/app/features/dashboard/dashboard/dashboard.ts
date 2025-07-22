import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { VehicleService } from '../../../core/services/vehicle.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IVehicle } from '../../../core/models/vehicle.model';
import { IViewState, ViewStateService } from '../../../core/services/view-state.service';
import { COLUMNS_CONFIG } from '../../../core/constants/configs.const';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { VehicleCard } from '../components/vehicle-card/vehicle-card';
import { VehicleTable } from '../components/vehicle-table/vehicle-table';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    VehicleTable,
    VehicleCard,
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard implements OnInit {
  destroyRef = inject(DestroyRef);
  dataSource: IVehicle[] = [];
  filteredData: IVehicle[] = [];
  sortedData: IVehicle[] = [];

  readonly columnsConfig = COLUMNS_CONFIG;
  columnFields = this.columnsConfig.map((c) => c.field);
  sortableFields = this.columnsConfig.filter((c) => c.isSortable).map((c) => c.field);

  uniqueMakes: string[] = [];
  modelsByMake: string[] = [];
  minBid = 0;
  maxBid = Infinity;

  viewState!: IViewState;

  constructor(
    private vehicleService: VehicleService,
    private viewStateService: ViewStateService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const hasParams = Object.keys(params).length > 0;
      if (hasParams) {
        this.viewStateService.updateFromQueryParams(params);
      }
      this.viewState = this.viewStateService.get();
      this.updateView(!hasParams);
    });

    if (this.vehicleService.vehicleData.length > 0) {
      this.initData();
    } else {
      this.vehicleService
        .getVehicles()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((data) => {
          this.vehicleService.vehicleData = data;
          this.initData();
        });
    }
  }

  initData() {
    this.viewState.pagination.length = this.vehicleService.vehicleData.length;
    this.vehicleService.setMinMaxBids();
    this.minBid = this.vehicleService.minAvailableBid;
    this.maxBid = this.vehicleService.maxAvailableBid;
    this.uniqueMakes = this.vehicleService.getUniqueMakes();
    this.updateView(true);
  }

  /**
   * Updates the component state based on filters and sort
   * @param initial specific rules for initial update
   */
  updateView(initial?: boolean) {
    const filters = this.viewState.filters;
    const sort = this.viewState.sort;

    this.filteredData = this.vehicleService.filterVehicles(this.vehicleService.vehicleData, filters);
    this.sortedData = this.vehicleService.sortVehicles(this.filteredData, sort);

    this.viewState.pagination.length = this.sortedData.length;
    this.updateDisplayedData();
    if (!initial) {
      this.updateUrlFromState();
    }
  }

  /**
   * Updates the currently displayed items based on pagination
   */
  updateDisplayedData() {
    const { pageIndex, pageSize } = this.viewState.pagination;
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    this.dataSource = this.sortedData.slice(start, end);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  handlePageEvent(e: PageEvent) {
    this.viewState.pagination.length = e.length;
    this.viewState.pagination.pageSize = e.pageSize;
    this.viewState.pagination.pageIndex = e.pageIndex;
    this.updateDisplayedData();
    this.updateUrlFromState();
  }

  /**
   * Sort handler based on field and current state direction
   * @param field the field to be sorted
   */
  sortBy(field: string) {
    if (!this.sortableFields.includes(field)) return;

    const sort = this.viewState.sort;
    sort.direction = sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc';
    sort.field = field;

    this.sortedData = this.vehicleService.sortVehicles(this.filteredData, sort);
    this.updateDisplayedData();
    this.updateUrlFromState();
  }

  toggleFavourite({ vehicle, event }: { vehicle: IVehicle; event: Event }) {
    event.stopPropagation();
    this.vehicleService.toggleFavourite(vehicle);
    this.updateView();
  }

  goToDetails(vehicle: IVehicle) {
    this.vehicleService.selectedVehicle = vehicle;
    this.router.navigate(['vehicle-details'], {
      queryParams: this.viewStateService.toQueryParams(),
    });
  }

  resetFilters() {
    this.viewStateService.reset(this.vehicleService.maxAvailableBid);
    this.viewState = this.viewStateService.get();
    this.updateUrlFromState(true);
    this.updateView(true);
  }

  /**
   * Updates the Url queryParams data
   * @param clear used to clear the Url queryParams
   */
  updateUrlFromState(clear?: boolean) {
    this.viewStateService.set(this.viewState);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: clear ? {} : this.viewStateService.toQueryParams(),
      queryParamsHandling: clear ? undefined : 'merge',
    });
  }

  onMakeChange() {
    this.modelsByMake = this.vehicleService.getModelsByMake(this.viewState.filters.make);
  }
}
