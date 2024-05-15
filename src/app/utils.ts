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
    LastDayMarketCapPercentage = 'marketCap24h',
    MarketCap = 'marketCap',
    Price = 'price',
    Volume = 'volume',
    PlusBtn = 'plus',
  }

  export const coinsTableColumns = [
    TableColumnEnum.Symbol,
    TableColumnEnum.Price,
    TableColumnEnum.LastDayMarketCapPercentage,
    TableColumnEnum.MarketCap,
    TableColumnEnum.Volume,
    TableColumnEnum.PlusBtn,
  ];

  export const coinsTableColumnHeader = new CustomMap<TableColumnEnum, string>([
    [TableColumnEnum.Symbol, 'Crypto'],
    [TableColumnEnum.LastDayMarketCapPercentage, '%Capitalisation'],
    [TableColumnEnum.MarketCap, 'Capitalisation'],
    [TableColumnEnum.Price, 'Prix'],
    [TableColumnEnum.Volume, 'volume'],
    [TableColumnEnum.PlusBtn, ''],
  ]);

  // coins details
  export enum CoinDetailsPriceChangeTableEnum {
    LastDay = '24h',
    LastWeek = '1week',
    LastMonth = '1month',
    LastYear = '1year',
  }

  export const coinDetailsPriceChangeColumns = [
    CoinDetailsPriceChangeTableEnum.LastDay,
    CoinDetailsPriceChangeTableEnum.LastWeek,
    CoinDetailsPriceChangeTableEnum.LastMonth,
    CoinDetailsPriceChangeTableEnum.LastYear,
  ];

  export const coinDetailsPriceChangeHeader = new CustomMap<
    CoinDetailsPriceChangeTableEnum,
    string
  >([
    [CoinDetailsPriceChangeTableEnum.LastDay, '24h'],
    [CoinDetailsPriceChangeTableEnum.LastWeek, '1 semaine'],
    [CoinDetailsPriceChangeTableEnum.LastMonth, '1 mois'],
    [CoinDetailsPriceChangeTableEnum.LastYear, '1 an'],
  ]);
}
