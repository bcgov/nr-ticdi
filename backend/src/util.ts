import { InterestParcel, TenantAddressResource } from './types';

export function formatMoney(value: number): string {
  return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

export function formatPostalCode(value: string) {
  const regex = /^(\w{3})(\w{3})$/;
  if (regex.test(value)) {
    return value.replace(regex, '$1 $2');
  } else {
    return value;
  }
}

/**
 * Outputs a string:
 * <Name 1>
 * <addrLine1>, <addrLine2>, <addrLine3>
 * <city prov postalCode>
 *
 * If there are two individuals that share an address, then:
 * <Name 1>
 * <Name 2>
 * <addrLine1>, <addrLine2>, <addrLine3>
 * <city prov postalCode>
 *
 * Combined example:
 * <Name 1> - different address from Name 2/3
 * <addrLine1>, <addrLine2>, <addrLine3>
 * <city prov postalCode>
 * <Name 2>
 * <Name 3> - same address as Name 2
 * <addrLine1>, <addrLine2>, <addrLine3>
 * <city prov postalCode>
 */
export function nfrAddressBuilder(tenantAddr: any[]): string {
  const uniqueAddresses = new Map<string, { names: Set<string>; addressLines: string; cityProvPostal: string }>();

  for (const addressObj of tenantAddr) {
    const { legalName, firstName, middleName, lastName, addrLine1, addrLine2, addrLine3, city, provAbbr, postalCode } =
      addressObj;

    let name = null;
    if (legalName) {
      name = legalName;
    } else if (firstName || middleName || lastName) {
      const parts = [firstName, middleName, lastName];
      const filteredParts = parts.filter((part) => part !== null && part !== undefined);
      name = filteredParts.join(' ');
    }

    const parts = [];
    if (city) {
      parts.push(city);
    }
    if (provAbbr) {
      parts.push(provAbbr);
    }
    if (postalCode) {
      parts.push(formatPostalCode(postalCode));
    }
    const cityProvPostal = parts.join(' ');

    let addressLines = [];
    if (addrLine1) addressLines.push(addrLine1);
    if (addrLine2) addressLines.push(addrLine2);
    if (addrLine3) addressLines.push(addrLine3);
    let joinedAddressLines = addressLines.join(', ');

    const key = joinedAddressLines + cityProvPostal;

    if (uniqueAddresses.has(key)) {
      const existingEntry = uniqueAddresses.get(key);
      existingEntry.names.add(name);
    } else {
      uniqueAddresses.set(key, { names: new Set([name]), addressLines: joinedAddressLines, cityProvPostal });
    }
  }

  const formattedAddresses: string[] = [];
  for (const { names, addressLines, cityProvPostal } of uniqueAddresses.values()) {
    const formattedNames = Array.from(names).join('\n');
    formattedAddresses.push(`${formattedNames}\n${addressLines}\n${cityProvPostal}\n`);
  }

  return formattedAddresses.join('\n');
}

/**
 * Similar to nfrAddressBuilder, slightly modified for gl
 * Outputs a string:
 * <Name 1>
 * <addrLine1>, <addrLine2>, <addrLine3>
 * <city prov postalCode>
 *
 * If there are two individuals that share an address, then:
 * <Name 1>
 * <Name 2>
 * <addrLine1>, <addrLine2>, <addrLine3>
 * <city prov postalCode>
 *
 * Combined example:
 * <Name 1> - different address from Name 2/3
 * <addrLine1>, <addrLine2>, <addrLine3>
 * <city prov postalCode>
 * <Name 2>
 * <Name 3> - same address as Name 2
 * <addrLine1>, <addrLine2>, <addrLine3>
 * <city prov postalCode>
 */
export function glAddressBuilder(
  tenantAddr: {
    addrLine1: string;
    addrLine2: string;
    addrLine3: string;
    addrType: string;
    firstName: string;
    middleName: string;
    lastName: string;
    legalName: string;
    city: string;
    country: string;
    provAbbr: string;
    postalCode: string;
  }[]
): { glMailingAddress: string; glStreetAddress: string; combinedAddress: string } {
  if (!tenantAddr) {
    return { glMailingAddress: '', glStreetAddress: '', combinedAddress: '' };
  }
  const uniqueMailingAddresses = new Map<
    string,
    { names: Set<string>; addressLines: string; cityProvPostal: string }
  >();
  const uniqueStreetAddresses = new Map<string, { names: Set<string>; addressLines: string; cityProvPostal: string }>();
  const uniqueAddresses = new Map<string, { names: Set<string>; addressLines: string; cityProvPostal: string }>();

  for (const addressObj of tenantAddr) {
    const {
      legalName,
      firstName,
      middleName,
      lastName,
      addrLine1,
      addrLine2,
      addrLine3,
      addrType,
      city,
      provAbbr,
      postalCode,
    } = addressObj;

    let name = null;
    if (legalName) {
      name = legalName;
    } else if (firstName || middleName || lastName) {
      const parts = [firstName, middleName, lastName];
      const filteredParts = parts.filter((part) => part !== null && part !== undefined);
      name = filteredParts.join(' ');
    }

    const parts = [];
    if (city) {
      parts.push(city);
    }
    if (provAbbr) {
      parts.push(provAbbr);
    }
    if (postalCode) {
      parts.push(formatPostalCode(postalCode));
    }
    const cityProvPostal = parts.join(' ');

    let addressLines = [];
    if (addrLine1) addressLines.push(addrLine1);
    if (addrLine2) addressLines.push(addrLine2);
    if (addrLine3) addressLines.push(addrLine3);
    let joinedAddressLines = addressLines.join(', ');

    const key = joinedAddressLines + cityProvPostal;

    if (addrType === 'MAILING') {
      if (uniqueMailingAddresses.has(key)) {
        const existingEntry = uniqueMailingAddresses.get(key);
        existingEntry.names.add(name);
      } else {
        uniqueMailingAddresses.set(key, { names: new Set([name]), addressLines: joinedAddressLines, cityProvPostal });
      }
    } else if (addrType === 'STREET') {
      if (uniqueStreetAddresses.has(key)) {
        const existingEntry = uniqueStreetAddresses.get(key);
        existingEntry.names.add(name);
      } else {
        uniqueStreetAddresses.set(key, { names: new Set([name]), addressLines: joinedAddressLines, cityProvPostal });
      }
    }
    if (uniqueAddresses.has(key)) {
      const existingEntry = uniqueAddresses.get(key);
      existingEntry.names.add(name);
    } else {
      uniqueAddresses.set(key, { names: new Set([name]), addressLines: joinedAddressLines, cityProvPostal });
    }
  }

  const formattedMailingAddresses: string[] = [];
  for (const { names, addressLines, cityProvPostal } of uniqueMailingAddresses.values()) {
    const formattedNames = Array.from(names).join('\n');
    formattedMailingAddresses.push(`${formattedNames}\n${addressLines}\n${cityProvPostal}\n`);
  }

  const formattedStreetAddresses: string[] = [];
  for (const { names, addressLines, cityProvPostal } of uniqueStreetAddresses.values()) {
    const formattedNames = Array.from(names).join('\n');
    formattedStreetAddresses.push(`${formattedNames}\n${addressLines}\n${cityProvPostal}\n`);
  }

  const formattedAddresses: string[] = [];
  for (const { names, addressLines, cityProvPostal } of uniqueAddresses.values()) {
    const formattedNames = Array.from(names).join('\n');
    formattedAddresses.push(`${formattedNames}\n${addressLines}\n${cityProvPostal}\n`);
  }

  return {
    glMailingAddress: formattedMailingAddresses.join('\n'),
    glStreetAddress: formattedStreetAddresses.join('\n'),
    combinedAddress: formattedAddresses.join('\n'),
  };
}

export function grazingLeaseVariables(
  tenantAddr: TenantAddressResource[],
  interestParcel: InterestParcel[],
  regVars: { regOfficeStreet: string; regOfficeCity: string; regOfficeProv: string; regOfficePostalCode: string }
): {
  streetAddress: string;
  streetName: string;
  streetCorp: string;
  mailingAddress: string;
  mailingName: string;
  mailingNameList: { name: string }[];
  mailingCorp: string;
  combinedAddress: string;
  combinedName: string;
  legalDescription: string;
  addressRegionalOffice: string;
  glMailingAddress: string;
  glStreetAddress: string;
} {
  let streetAddress = '';
  let streetName = '';
  let streetNameList = [];
  let streetCorp = '';
  let mailingAddress = '';
  let mailingName = '';
  let mailingNameList = [];
  let mailingCorp = '';
  let combinedName = '';
  let legalDescription = '';
  let addressRegionalOffice = '';
  const { glMailingAddress, glStreetAddress, combinedAddress } = glAddressBuilder(tenantAddr);

  if (tenantAddr) {
    for (let tenant of tenantAddr) {
      if (tenant.addrType == 'MAILING') {
        const tempMailingAddress = getMailingAddress(tenant);
        mailingAddress =
          mailingAddress.length > 0 ? [mailingAddress, tempMailingAddress].join('\n ') : tempMailingAddress;
        const tempMailingName = getFullName(tenant);
        if (!mailingNameList.some((entry) => entry.name === tempMailingName)) {
          mailingNameList.push({ name: tempMailingName });
        }
        mailingName = mailingName.length > 0 ? [mailingName, tempMailingName].join('\n ') : tempMailingName;
        const tempMailingCorp = getCorp(tenant);
        if (!mailingCorp.split('\n ').includes(tempMailingCorp)) {
          mailingCorp = mailingCorp.length > 0 ? [mailingCorp, tempMailingCorp].join('\n ') : tempMailingCorp;
        }
      } else if (tenant.addrType == 'STREET') {
        const tempStreetAddress = getMailingAddress(tenant);
        streetAddress = streetAddress.length > 0 ? [streetAddress, tempStreetAddress].join('\n ') : tempStreetAddress;
        const tempStreetName = getFullName(tenant);
        streetNameList.push({ name: tempStreetName });
        streetName = streetName.length > 0 ? [streetName, tempStreetName].join('\n ') : tempStreetName;
        const tempStreetCorp = getCorp(tenant);
        streetCorp = streetCorp.length > 0 ? [streetCorp, tempStreetCorp].join('\n ') : tempStreetCorp;
      }
      const tempCombinedName = getFullName(tenant);
      if (!combinedName.split('\n ').includes(tempCombinedName)) {
        combinedName = combinedName.length > 0 ? [combinedName, tempCombinedName].join('\n ') : tempCombinedName;
      }
    }

    // if either address is empty, set it to the other
    if (mailingAddress.length == 0) {
      mailingAddress = streetAddress;
    }
    if (streetAddress.length == 0) {
      streetAddress = mailingAddress;
    }
    // if either name is empty, set it to the other
    if (mailingName.length == 0) {
      mailingName = streetName;
    }
    if (streetName.length == 0) {
      streetName = mailingName;
    }
    // if either corp is empty, set it to the other
    if (mailingCorp.length == 0) {
      mailingCorp = streetCorp;
    }
    if (streetCorp.length == 0) {
      streetCorp = mailingCorp;
    }
    // if either list of names is empty, set it to the other
    if (mailingNameList.length == 0) {
      mailingNameList = streetNameList;
    }
  }
  if (interestParcel) {
    for (let parcel of interestParcel) {
      const tempLegalDescription = parcel.legalDescription;
      legalDescription =
        legalDescription.length > 0 ? [legalDescription, tempLegalDescription].join('\n ') : tempLegalDescription;
    }
  }
  if (regVars.regOfficeStreet.length > 0) {
    addressRegionalOffice = regVars.regOfficeStreet;
  }
  if (regVars.regOfficeCity.length > 0) {
    addressRegionalOffice = [addressRegionalOffice, regVars.regOfficeCity].join(', ');
  }
  if (regVars.regOfficeProv.length > 0) {
    addressRegionalOffice = [addressRegionalOffice, regVars.regOfficeProv].join(', ');
  }
  if (regVars.regOfficePostalCode.length > 0) {
    addressRegionalOffice = [addressRegionalOffice, regVars.regOfficePostalCode].join(', ');
  }

  return {
    streetAddress,
    streetName,
    streetCorp,
    mailingAddress,
    mailingName,
    mailingNameList,
    mailingCorp,
    legalDescription,
    addressRegionalOffice,
    glMailingAddress,
    glStreetAddress,
    combinedAddress,
    combinedName,
  };
}

function getFullName(tenant: { firstName: string; middleName: string; lastName: string; legalName: string }): string {
  const nameParts = [];
  let legalName;
  if (tenant.firstName !== null) {
    nameParts.push(tenant.firstName);
  }
  if (tenant.middleName !== null) {
    nameParts.push(tenant.middleName);
  }
  if (tenant.lastName !== null) {
    nameParts.push(tenant.lastName);
  }
  if (tenant.legalName !== null) {
    legalName = tenant.legalName;
  }

  let fullName = nameParts.join(' ');
  if (fullName.length === 0 && legalName) {
    fullName = legalName;
  }

  return fullName;
}

function getCorp(tenant: { legalName: string }): string {
  return tenant.legalName ?? '';
}

/**
 * Used by grazingLeaseVariables, formats and returns a mailing address
 *
 * @param tenantAddr: {addrLine1, addrLine2, addrLine3, city, country, provAbbr, postalCode}
 * @returns
 *
 * addrLine1, addrLine2, addrLine3
 * city, provAbbr postalCode
 */
export function getMailingAddress(tenantAddr: {
  firstName: string;
  middleName: string;
  lastName: string;
  legalName: string;
  addrLine1: string;
  addrLine2: string;
  addrLine3: string;
  city: string;
  country: string;
  provAbbr: string;
  postalCode: string;
}): string {
  const addressComponents = [tenantAddr.addrLine1, tenantAddr.addrLine2, tenantAddr.addrLine3];

  const combinedAddress = addressComponents
    .filter((component) => !!component) // Filter out undefined or empty components
    .join(', ');

  const cityPostalCode = [tenantAddr.city, tenantAddr.provAbbr, tenantAddr.postalCode]
    .filter((component) => !!component)
    .join(' ');

  const mailingAddress = [combinedAddress, cityPostalCode].filter((part) => !!part).join('\n');

  return mailingAddress;
}

export function getNFRMailingAddress(tenantAddr: { addrLine1: string; addrLine2: string; addrLine3: string }): string {
  let mailingAddress = '';
  if (tenantAddr && tenantAddr.addrLine1) {
    mailingAddress = tenantAddr.addrLine1;
  }
  if (tenantAddr && tenantAddr.addrLine2) {
    mailingAddress = mailingAddress.concat(', ' + tenantAddr.addrLine2);
  }
  if (tenantAddr && tenantAddr.addrLine3) {
    mailingAddress = mailingAddress.concat(', ' + tenantAddr.addrLine3);
  }
  return mailingAddress;
}

export function nfrInterestedParties(
  tenantAddr: {
    firstName: string;
    middleName: string;
    lastName: string;
    legalName: string;
    addrLine1: string;
    addrLine2: string;
    addrLine3: string;
    city: string;
    country: string;
    provAbbr: string;
    postalCode: string;
  }[]
) {
  const result: { clientName: string; address: string }[] = [];
  const seenCombinations = new Set<string>();

  for (const client of tenantAddr) {
    let clientName: string;
    if (client.legalName) {
      clientName = client.legalName;
    } else {
      clientName = [client.firstName, client.middleName, client.lastName].filter(Boolean).join(' ');
    }

    const address = getMailingAddress(client);
    const combination = `${clientName}-${address}`;

    if (!seenCombinations.has(combination)) {
      result.push({
        clientName,
        address,
      });
      seenCombinations.add(combination);
    }
  }

  return result;
}

// used by report service to convert strings to a specific format
// such as «DB_TENURE_TYPE» to {d.DB_Tenure_Type}
export function convertToSpecialCamelCase(str) {
  if (str.toLowerCase().startsWith('db_') || str.toLowerCase().startsWith('var_')) {
    return str
      .toLowerCase()
      .replace(/_([a-z])/g, function (match, letter) {
        return '_' + letter.toUpperCase();
      })
      .replace(/^[a-z]*/g, function (match, letter) {
        return match.toUpperCase();
      });
  } else {
    return str;
  }
}

// LUR util functions carried over
export function getLicenceHolderName(tenantAddr: {
  firstName: string;
  middleName: string;
  lastName: string;
  legalName: string;
}): string {
  return tenantAddr.legalName
    ? tenantAddr.legalName
    : [tenantAddr.firstName, tenantAddr.middleName, tenantAddr.lastName].filter(Boolean).join(' ');
}

// returns the individual name
export function getLicenceHolder(tenantAddr: { firstName: string; middleName: string; lastName: string }): string {
  if (tenantAddr && (tenantAddr.firstName || tenantAddr.middleName || tenantAddr.lastName)) {
    let name = tenantAddr.firstName ? tenantAddr.firstName : '';
    name = tenantAddr.middleName ? name.concat(' ' + tenantAddr.middleName) : name;
    name = tenantAddr.lastName ? name.concat(' ' + tenantAddr.lastName) : name;
    return name;
  }
  return '';
}

// returns the individual name
export function getContactAgent(firstName: string, middleName: string, lastName: string): string {
  if (firstName || middleName || lastName) {
    let name = firstName ? firstName : '';
    name = middleName ? name.concat(' ' + middleName) : name;
    name = lastName ? name.concat(' ' + lastName) : name;
    return name;
  }
  return '';
}

export function concatCityProvPostal(tenantAddr: { city: string; provAbbr: string; postalCode: string }): string {
  const addressParts = [];
  if (tenantAddr) {
    if (tenantAddr.city) {
      addressParts.push(tenantAddr.city);
    }

    if (tenantAddr.provAbbr) {
      addressParts.push(tenantAddr.provAbbr);
    }

    if (tenantAddr.postalCode) {
      addressParts.push(formatPostalCode(tenantAddr.postalCode));
    }
  }

  return addressParts.join(' ');
}

export function formatInspectedDate(inspected_date: string): string {
  if (inspected_date && inspected_date.length == 8) {
    return inspected_date.substring(0, 4) + '-' + inspected_date.substring(4, 6) + '-' + inspected_date.substring(6, 8);
  }
  return inspected_date;
}

export function formatPhoneNumber(phone_number: string, area_code: string): string {
  if (phone_number && phone_number.length == 10) {
    return phone_number.replace(/(\d{3})(\d{3})(\d{4})/, '($1)$2-$3');
  } else if (phone_number && area_code && (phone_number + area_code).length == 10) {
    return (area_code + phone_number).replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  } else {
    return '';
  }
}
