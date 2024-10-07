import BigNumber from 'bignumber.js';
import { each, extend, find } from 'lodash';
// import Jazzicon from "@metamask/jazzicon";
export function deepClone(variable) {
  try {
    return JSON.parse(JSON.stringify(variable)); //deep copy
  } catch (error) {
    return null;
  }
}
export function merge() {
  const target = {};
  let recursiver = obj => {
    for (const prop in obj) {
      if ({}.hasOwnProperty.call(obj, prop)) {
        target[prop] =
          Object.prototype.toString.call(obj[prop]) === '[object Object]'
            ? merge(target[prop], obj[prop])
            : obj[prop];
      }
    }
  };
  for (const arg of arguments) {
    recursiver(arg);
  }
  return target;
}
// merge 2 array by prop
export function mergeByProperty(arr1, arr2, prop) {
  each(arr2, function (arr2obj) {
    var arr1obj = find(arr1, function (arr1obj) {
      return arr1obj[prop] === arr2obj[prop];
    });

    arr1obj ? extend(arr1obj, arr2obj) : arr1.push(arr2obj);
  });
}

export function truncate(str, n, frontChars, backChars, separator) {
  /**
   * str: Input string
   * n: Number of character want to display
   * frontChars: Number of characters in front of separator
   * backChars: Number of characters in back of separator
   * seperator: Symbol want to display, default "..."
   */
  const sep = separator || '...';
  const sepLen = sep.length;
  if (str.length < n - sepLen) {
    return str;
  }
  return str.substr(0, frontChars) + sep + str.substr(str.length - backChars);
}

export function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export function getFilename(url) {
  if (url) {
    let m = url
      .split('/')
      .pop()
      .replace(/\?(.*?)$/, '');

    if (m && m.length > 1) {
      return m;
    }
  }
  return '';
}
export function get_url_extension(url) {
  return new Promise(resolve => {
    fetch(url, { method: 'HEAD' })
      .then(response => response.headers.get('Content-Type'))
      .then(type => resolve(type.replace(/.+\/|;.+/g, '')));
  });
}

export function hexToDec(hexString) {
  return parseInt(hexString, 16);
}
export function dectoHex(number) {
  return Number(number).toString(16);
}
export function bnum(val) {
  const number = typeof val === 'string' ? val : val ? val.toString() : '0';
  return new BigNumber(number);
}

export function scale(input, decimalPlaces) {
  const scalePow = new BigNumber(decimalPlaces.toString());
  const scaleMul = new BigNumber(10).pow(scalePow);
  return input.times(scaleMul);
}

export function toWei(val) {
  return scale(bnum(val.toString()), 18).integerValue().toString();
}

export function toUnitWithDecimal(val, decimal) {
  return scale(bnum(val.toString()), decimal).integerValue().toString();
}

export function toAmountShow(val, decimals = 18, numFixed = 0) {
  if (!val) return 0;
  let tmp = BigNumber(val || 0).div(Math.pow(10, decimals));
  return numFixed ? tmp.toFixed(numFixed) : tmp.toNumber();
}
export function guidGenerator() {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
}
// export function getMetamaskAvatar(diameter, address) {
//   if (!diameter || !address) return "";
//   const avatar = Jazzicon(diameter, parseInt(address.slice(2, 10), 16));
//   // console.log(avatar, "avatar");
//   return avatar.outerHTML;
// }

export const convertType = data => {
  const tmp = data;
  return Object.keys(data).map(item => {
    return {
      value: tmp[item],
      key: item,
      label: `PRAMS_TYPE_${item.toLocaleUpperCase()}`,
    };
  });
};
export const hex_to_ascii = str1 => {
  var hex = str1.toString();
  var str = '';
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
};

export const mapMsgError = (error, duration = 5) => {
  console.log(error, 'errorAAA');
  if (error?.code === '4001' || error?.cause?.code) {
    return {
      type: 'error',
      content: error?.shortMessage || error.cause?.message || error?.message,
      duration: duration,
    };
  }
  let message =
    error?.shortMessage ||
    error?.cause?.shortMessage ||
    error?.data?.message ||
    error?.message ||
    error?.code ||
    error;
  console.log(message, 'message');
  message = getMessageErrorFromSC(message);
  console.log(message, 'messageAfter');
  return {
    type: 'error',
    content: message,
    duration: duration,
  };
};

export const mapMsgSuccess = (content, duration = 5) => {
  return {
    type: 'success',
    content: content,
    duration: duration,
  };
};

export const uniqueArr = arr => {
  let newArr = arr.reduce(function (accumulator, element) {
    if (accumulator.indexOf(element) === -1) {
      accumulator.push(element);
    }
    return accumulator;
  }, []);
  return newArr;
};
export function truncateDecimal(number, precision = 6) {
  if (!number) return 0;
  const [integerPart, fractionalPart] = number.toString().split('.');

  if (!fractionalPart) {
    return integerPart;
  }

  const truncatedFractionalPart = fractionalPart.slice(0, precision);

  // Combine the integer part and the truncated fractional part
  const result = integerPart + (truncatedFractionalPart ? '.' + truncatedFractionalPart : '');

  // Convert to a number and back to string to remove trailing zeros
  return parseFloat(result).toString();
}

export function convertExponentialToDecimal(exponentialNumber) {
  let [coefficient, exponent] = exponentialNumber.toString().split('e').map(Number);
  if (exponent < 0) {
    const decimalPlaces = Math.abs(exponent);
    coefficient = coefficient.toFixed(
      decimalPlaces + coefficient.toString().split('.')[1]?.length || 0,
    );
    return '0.' + '0'.repeat(decimalPlaces - 1) + coefficient.replace('.', '');
  } else {
    return exponentialNumber.toString();
  }
}
export function toCurrency(value, decimalPlaces = 6) {
  if (!value) return 0;
  // Convert the value to a string
  const valueStr = value.toString();

  // Check if the value contains a decimal point
  const parts = valueStr.split('.');

  // Format the integer part with commas
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // If there is a decimal part, format it as necessary
  if (parts.length > 1) {
    // Round the decimal part to the specified number of decimal places
    const decimalPart = parts[1].substring(0, decimalPlaces);
    // Remove trailing zeros from the decimal part
    const trimmedDecimalPart = decimalPart.replace(/0+$/, '');

    // Return the formatted number
    return `${integerPart}.${trimmedDecimalPart}`;
  }

  // If there is no decimal part, return the formatted integer part
  return integerPart;
}
export function toLessPart(val, numFloor, isRound) {
  if (!val) return 0;
  let finalValue = val ? Math.floor(val * Math.pow(10, numFloor)) / Math.pow(10, numFloor) : val;
  return isRound ? Math.ceil(finalValue * 1000) / 1000 : finalValue;
}
