export function getExchangeRate(token: string) {
  return fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=usd`)
    .then((res) => res.json())
    .then((data) => data[token].usd);
}
