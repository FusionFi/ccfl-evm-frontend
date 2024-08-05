export function computeWithMinThreashold(value) {
  if (!value) {
    return `0%`;
  }

  if (value < 0.01) {
    return `<0.01%`
  }

  const valueStr = value.toString();

  // Check if the value contains a decimal point
  const parts = valueStr.split('.');

  // Format the integer part with commas
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  if (parts.length > 1) {
    const decimalPart = parts[1].substring(0, 2);
    const trimmedDecimalPart = decimalPart.replace(/0+$/, '');

    return `${integerPart}.${trimmedDecimalPart} %`;
  }

  return integerPart + '%';

}