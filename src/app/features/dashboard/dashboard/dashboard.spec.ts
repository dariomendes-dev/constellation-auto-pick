import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dashboard } from './dashboard';
import { VehicleService } from '../../../core/services/vehicle.service';
import { ViewStateService } from '../../../core/services/view-state.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { VehicleCard } from '../components/vehicle-card/vehicle-card';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Dashboard, VehicleCard],
      providers: [
        {
          provide: VehicleService,
          useValue: {
            sortVehicles: (data: any[]) => data.sort((a, b) => a.id - b.id),
            filterVehicles: (data: any[]) => data,
            vehicleData: [],
            getVehicles: () => of([]),
          },
        },
        { provide: Router, useValue: { navigate: () => {} } },
        { provide: ActivatedRoute, useValue: { queryParams: of({}) } },
      ],
    });

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    component.filteredData = [{ id: 2 }, { id: 1 }] as any;
    component.viewState = {
      filters: {} as any,
      pagination: { pageIndex: 0, pageSize: 10, length: 0 },
      sort: { field: '', direction: 'asc' },
      viewType: 'card',
    };
  });

  it('should render title', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Auto Pick');
  });

  it('should render vehicle cards', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-vehicle-card')).toBeTruthy();
  });

  it('should update sort field and direction when sortBy is called', () => {
    component.sortableFields = ['id'];
    component.sortBy('id');
    expect(component.viewState.sort.field).toBe('id');
    expect(['asc', 'desc']).toContain(component.viewState.sort.direction);
  });
});
