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
  export enum Currency {
    Euro = 'EUR',
    AmericanDollar = 'USD',
    CanadianDollar = 'CAD',
    Yuan = 'CNY',
    LivreSterling = 'GBP',
  }

  export const currencies = [
    Currency.Euro,
    Currency.AmericanDollar,
    Currency.CanadianDollar,
    Currency.Yuan,
    Currency.LivreSterling,
  ];

  export enum TableColumnEnum {
    Symbol = 'name',
    LastDay = '24h',
    MarketCap = 'marketCap',
    Price = 'price',
    Volume = 'volume',
    PlusBtn = 'plus',
  }

  export const coinsTableColumns = [
    TableColumnEnum.Symbol,
    TableColumnEnum.Price,
    TableColumnEnum.LastDay,
    TableColumnEnum.MarketCap,
    TableColumnEnum.Volume,
    TableColumnEnum.PlusBtn,
  ];

  export const coinsTableColumnHeader = new CustomMap<TableColumnEnum, string>([
    [TableColumnEnum.Symbol, 'Crypto'],
    [TableColumnEnum.LastDay, 'market cap%'],
    [TableColumnEnum.MarketCap, 'market cap'],
    [TableColumnEnum.Price, 'Prix'],
    [TableColumnEnum.Volume, 'volume'],
    [TableColumnEnum.PlusBtn, ''],
  ]);
}
