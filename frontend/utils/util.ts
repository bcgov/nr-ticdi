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

export function nfrAddressBuilder(
  name: string | null,
  addr1: string | null,
  city: string | null,
  province: string | null,
  postalCode: string | null
): string {
  const addressParts = [];
  if (name) {
    addressParts.push(name);
  }
  if (addr1) {
    addressParts.push(addr1);
  }

  const parts = [];
  if (city) {
    parts.push(city);
  }
  if (province) {
    parts.push(province);
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
