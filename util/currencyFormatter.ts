const defaultOptions = {
  symbol: '$',
  significantDigits: 2,
  thousandsSeparator: ',',
  decimalSeparator: '.',
};

export const currencyFormatter = (value, options) => {
  if (typeof value !== 'number') value = 0.0;
  options = {...defaultOptions, ...options};
  value = value.toFixed(options.significantDigits);

  let {currency, decimal} = 0;

  if (options.significantDigits !== 0) {
    [currency, decimal] = value.split('.');
  }
  currency = value;
  decimal = 0;

  if (decimal !== 0) {
    return `${options.symbol} ${currency.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      options.thousandsSeparator,
    )}${options.decimalSeparator}${decimal}`;
  }

  return `${options.symbol} ${currency.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    options.thousandsSeparator,
  )}`;
};
