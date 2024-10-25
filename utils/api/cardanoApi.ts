export interface CardanoLoan {
  loanTokenName: string; // onchain loan/collateral Identifier
  oracleTokenName: string; // onchain oracle Identifier
  loanValue: number; // in native assets e.g. USDA
  userPkh: string; // PubKeyCredential public wallet Identifier
}

export interface OracleData {
  oracleTokenName: string; // onchain oracle Identifier
  currency: string; // currency of the oracle price feed
}

export async function createOracle(oracleTokenName: string, currency: string): Promise<OracleData> {
  const oracleData: OracleData = {
    oracleTokenName: oracleTokenName,
    currency: currency
  };

  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/cardano/oracle/data/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(oracleData),
  })

  return response.json();
}

export async function getOracles(): Promise<OracleData[]> {
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/cardano/oracle/data/all', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return response.json();
}

export async function createLoan(loanTokenName: string, oracleTokenName: string, loanValue: number, userPkh: string): Promise<CardanoLoan> {
  const loanData: CardanoLoan = {
    loanTokenName: loanTokenName,
    oracleTokenName: oracleTokenName,
    loanValue: loanValue,
    userPkh: userPkh
  };

  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/cardano/loan/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loanData),
  })

  return response.json();
}

export async function getLoans(userPkh: string): Promise<CardanoLoan[]> {
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/cardano/loan/' + userPkh, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const loans: CardanoLoan[] = await response.json();

  let userLoans: CardanoLoan[] = [];

  for (let i = 0; i < loans.length; i++) {
    if (loans[i].userPkh === userPkh) {
      userLoans.push(loans[i]);
    }
  }

  return userLoans;
}