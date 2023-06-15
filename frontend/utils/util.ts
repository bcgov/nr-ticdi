export function formatMoney(value: number): string {
  return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
}

export function formatPostalCode(value: string) {
  const regex = /^(\w{3})(\w{3})$/;
  if (regex.test(value)) {
    return value.replace(regex, "$1 $2");
  } else {
    return value;
  }
}

export function nfrAddressBuilder(tenantAddr: any): string {
  const {
    legalName,
    firstName,
    middleName,
    lastName,
    addrLine1,
    city,
    provAbbr,
    postalCode,
  } = tenantAddr;
  const addressParts = [];
  let name = null;
  if (legalName) {
    name = legalName;
  } else if (firstName || middleName || lastName) {
    const parts = [firstName, middleName, lastName];
    const filteredParts = parts.filter(
      (part) => part !== null && part !== undefined
    );
    name = filteredParts.join(" ");
  }
  if (name) {
    addressParts.push(name);
  }
  if (addrLine1) {
    addressParts.push(addrLine1);
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
  const address = parts.join(" ");

  if (address) {
    addressParts.push(address);
  }

  return addressParts.join("\n");
}

export function getMailingAddress(tenantAddr: {
  addrLine1: string;
  addrLine2: string;
  addrLine3: string;
}): string {
  let mailingAddress = "";
  if (tenantAddr && tenantAddr.addrLine1) {
    mailingAddress = tenantAddr.addrLine1;
  }
  if (tenantAddr && tenantAddr.addrLine2) {
    mailingAddress = mailingAddress.concat(", " + tenantAddr.addrLine2);
  }
  if (tenantAddr && tenantAddr.addrLine3) {
    mailingAddress = mailingAddress.concat(", " + tenantAddr.addrLine3);
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
  }[]
) {
  const result: { clientName: string; address: string }[] = [];
  for (const client of tenantAddr) {
    let clientName: string;
    if (client.legalName) {
      clientName = client.legalName;
    } else {
      clientName = [client.firstName, client.middleName, client.lastName]
        .filter(Boolean)
        .join(" ");
    }
    result.push({
      clientName,
      address: getMailingAddress(client),
    });
  }
  return result;
}

// used by report service to convert strings to a specific format
// such as «DB_TENURE_TYPE» to {d.DB_Tenure_Type}
export function convertToSpecialCamelCase(str) {
  if (
    str.toLowerCase().startsWith("db_") ||
    str.toLowerCase().startsWith("var_")
  ) {
    return str
      .toLowerCase()
      .replace(/_([a-z])/g, function (match, letter) {
        return "_" + letter.toUpperCase();
      })
      .replace(/^[a-z]*/g, function (match, letter) {
        return match.toUpperCase();
      });
  } else {
    return str;
  }
}
