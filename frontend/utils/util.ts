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

/**
 * Outputs a string:
 * <Name 1>
 * <addrLine1>
 * <city prov postalCode>
 *
 * If there are two individuals that share an address, then:
 * <Name 1>
 * <Name 2>
 * <addrLine1>
 * <city prov postalCode>
 *
 * Combined example:
 * <Name 1> - different address from Name 2/3
 * <addrLine1>
 * <city prov postalCode>
 * <Name 2>
 * <Name 3> - same address as Name 2
 * <addrLine1>
 * <city prov postalCode>
 */
export function nfrAddressBuilder(tenantAddr: any[]): string {
  const addressMap = new Map<string, string[]>();
  for (const addressObj of tenantAddr) {
    const {
      legalName,
      firstName,
      middleName,
      lastName,
      addrLine1,
      city,
      provAbbr,
      postalCode,
    } = addressObj;

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

    const key = [addrLine1, address].join(",");
    if (!addressMap.has(key)) {
      addressMap.set(key, []);
    }

    const addressParts = [];
    if (name) {
      addressParts.push(name);
    }
    addressMap.get(key)?.push(addressParts.join("\n"));
  }

  const formattedAddresses: string[] = [];
  for (const [key, addresses] of addressMap.entries()) {
    const [addrLine1, cityProvAbbrPostalCode] = key.split(",");
    formattedAddresses.push(...addresses, addrLine1, cityProvAbbrPostalCode);
  }
  return formattedAddresses.join("\n");
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
