export const COLUMNS_CONFIG: IColumnConfig[] = [
  { field: 'image', label: '', isSortable: false },
  { field: 'make', label: 'Make', isSortable: true },
  { field: 'model', label: 'Model', isSortable: false },
  { field: 'engineSize', label: 'Engine size', isSortable: false },
  { field: 'fuel', label: 'Fuel', isSortable: false },
  { field: 'year', label: 'Year', isSortable: false },
  { field: 'mileage', label: 'Mileage', isSortable: true },
  { field: 'auctionDateTime', label: 'Auction date time', isSortable: true },
  { field: 'startingBid', label: 'Starting bid', isSortable: true },
  { field: 'favourite', label: 'Favourite', isSortable: false },
];

export interface IColumnConfig {
  field: string;
  label: string;
  isSortable: boolean;
}
