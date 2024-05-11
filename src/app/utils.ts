export class CustomMap<K, V> {
  #map = new Map();

  constructor(entries: [K, V][]) {
    entries.forEach(([k, v]) => this.#map.set(k, v));
  }

  get(k: K) {
    return this.#map.has(k) ? this.#map.get(k) : undefined;
  }
}
export namespace Utils {
  export type Currency = 'EUR' | 'USD';

  export enum TableColumnEnum {
    Name = 'name',
    LastDay = '24h',
    Price = 'price',
    Volume = 'volume',
  }

  export const coinsTableColumns = [
    TableColumnEnum.Name,
    TableColumnEnum.Price,
    TableColumnEnum.LastDay,
    TableColumnEnum.Volume,
  ];

  export const coinsTableColumnHeader = new CustomMap<TableColumnEnum, string>([
    [TableColumnEnum.Name, 'Name'],
    [TableColumnEnum.LastDay, '24h'],
    [TableColumnEnum.Price, 'Prix'],
    [TableColumnEnum.Volume, 'volume'],
  ]);
}
