import { Injectable } from '@angular/core';
import { Params } from '@angular/router';

export interface IViewState {
  filters: IFilters;
  sort: {
    field: string;
    direction: 'asc' | 'desc';
  };
  pagination: {
    pageIndex: number;
    pageSize: number;
    length?: number;
  };
  viewType: 'card' | 'table';
}

export interface IFilters {
  make: string;
  model: string;
  minBid: number;
  maxBid: number;
  favouritesOnly: boolean;
}

@Injectable({ providedIn: 'root' })
export class ViewStateService {
  private state: IViewState = {
    filters: {
      make: '',
      model: '',
      minBid: 0,
      maxBid: Infinity,
      favouritesOnly: false,
    },
    sort: { field: 'default', direction: 'asc' },
    pagination: { pageIndex: 0, pageSize: 10, length: 0 },
    viewType: 'card',
  };

  get(): IViewState {
    return this.state;
  }

  set(state: IViewState) {
    this.state = state;
  }

  reset(maxAvBid?: number) {
    this.state = {
      filters: {
        make: '',
        model: '',
        minBid: 0,
        maxBid: maxAvBid ?? Infinity,
        favouritesOnly: false,
      },
      sort: { field: 'default', direction: 'asc' },
      pagination: { pageIndex: 0, pageSize: 10, length: 0 },
      viewType: 'card',
    };
  }

  /**
   * Updates the state with params
   * @param params params object
   */
  updateFromQueryParams(params: Params) {
    this.state = {
      filters: {
        make: params['make'] || '',
        model: params['model'] || '',
        minBid: this.parseNumber(params['minBid']) ?? 0,
        maxBid: this.parseNumber(params['maxBid']) ?? Infinity,
        favouritesOnly: params['favouritesOnly'] === 'true',
      },
      sort: {
        field: params['sort'] || '',
        direction: params['dir'] === 'desc' ? 'desc' : 'asc',
      },
      pagination: {
        pageIndex: this.parseNumber(params['pageIndex']) ?? 0,
        pageSize: this.parseNumber(params['pageSize']) ?? 10,
      },
      viewType: params['viewType'] === 'table' ? 'table' : 'card',
    };
  }

  /**
   * @returns object to be used as queryParams on route navigate
   */
  toQueryParams(): Params {
    return {
      ...this.state.filters,
      sort: this.state.sort.field,
      dir: this.state.sort.direction,
      pageIndex: this.state.pagination.pageIndex,
      pageSize: this.state.pagination.pageSize,
      viewType: this.state.viewType,
    };
  }

  private parseNumber(value: any, fallback = undefined): number | undefined {
    const num = Number(value);
    return isNaN(num) ? fallback : num;
  }
}
