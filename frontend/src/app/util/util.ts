import { AreaItem, DTR, InterestParcel, InterestedParties, TenantAddressResource } from '../types/types';

/**
 * Formats and returns a full mailing address
 *
 * @param tenantAddr: {addrLine1, addrLine2, addrLine3, city, country, provAbbr, postalCode}
 * @returns
 *
 * addrLine1, addrLine2, addrLine3
 * city, provAbbr postalCode
 */
const getFullMailingAddress = (tenantAddr: TenantAddressResource): string => {
  const addressComponents = [tenantAddr.addrLine1, tenantAddr.addrLine2, tenantAddr.addrLine3];

  const combinedAddress = addressComponents.filter((component) => component).join(', ');

  const cityPostalCode = [tenantAddr.city, tenantAddr.provAbbr, tenantAddr.postalCode]
    .filter((component) => component)
    .join(' ');

  const mailingAddress = [combinedAddress, cityPostalCode].filter((part) => part).join('\n');

  return mailingAddress;
};

/**
 * Concatenates the address lines into one line
 *
 * @param tenantAddr
 * @returns a formatted mailing address
 */
const getSimpleMailingAddress = (tenantAddr: TenantAddressResource): string => {
  const { addrLine1, addrLine2, addrLine3 } = tenantAddr;
  return [addrLine1, addrLine2, addrLine3].filter((line) => line).join(', ');
};

/**
 *
 * @param tenant
 * @returns full name from first item in tenantAddr
 */
const getFullName = (firstName: string | null, middleName: string | null, lastName: string | null): string => {
  return [firstName, middleName, lastName].filter((name) => name !== null).join(' ');
};

const formatPhoneNumber = (phone_number: string, area_code: string): string => {
  if (phone_number && phone_number.length === 10) {
    return phone_number.replace(/(\d{3})(\d{3})(\d{4})/, '($1)$2-$3');
  } else if (phone_number && area_code && (phone_number + area_code).length === 10) {
    return (area_code + phone_number).replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  } else {
    return '';
  }
};

const formatPostalCode = (value: string): string => {
  const regex = /^(\w{3})(\w{3})$/;
  if (regex.test(value)) {
    return value.replace(regex, '$1 $2');
  } else {
    return value;
  }
};

const getCityProvPostal = (tenantAddr: TenantAddressResource): string => {
  const { city, provAbbr, postalCode } = tenantAddr;
  return [city, provAbbr, postalCode ? formatPostalCode(postalCode) : ''].filter(Boolean).join(' ');
};

const formatInspectedDate = (inspected_date: string | null): string => {
  if (inspected_date && inspected_date.length === 8) {
    return inspected_date.substring(0, 4) + '-' + inspected_date.substring(4, 6) + '-' + inspected_date.substring(6, 8);
  }
  return inspected_date ? inspected_date : '';
};

/**
 * Generates an array of unique interested parties
 *
 * @param tenantAddr
 * @returns an array of interested parties
 */
const getInterestedParties = (tenantAddr: TenantAddressResource[]): InterestedParties[] => {
  const result: { clientName: string; address: string }[] = [];
  const seenCombinations = new Set<string>();

  for (const client of tenantAddr) {
    let clientName: string;
    if (client.legalName) {
      clientName = client.legalName;
    } else {
      clientName = [client.firstName, client.middleName, client.lastName].filter(Boolean).join(' ');
    }

    const address = getFullMailingAddress(client);
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
};

const getAreaList = (interestParcel: InterestParcel[]): AreaItem[] => {
  return interestParcel.map((parcel) => ({
    areaInHectares: parcel.areaInHectares,
    legalDescription: parcel.legalDescription,
  }));
};

export const buildDTRDisplayData = (data: DTR) => {
  const tenantAddr: TenantAddressResource[] = (data && data.tenantAddr) ?? data.tenantAddr;
  const firstTenant: TenantAddressResource = tenantAddr[0];

  let primaryContactName: string = '';
  let primaryContactEmail: string = '';
  let primaryContactPhone: string = '';
  let incorporationNum: string = '';
  let address: string = '';
  let cityProvPostal: string = '';
  let country: string = '';

  if (firstTenant) {
    primaryContactName = getFullName(firstTenant.firstName, firstTenant.middleName, firstTenant.lastName);
    primaryContactEmail = firstTenant.emailAddress ? firstTenant.emailAddress : '';
    primaryContactPhone = formatPhoneNumber(
      firstTenant.phoneNumber ? firstTenant.phoneNumber : '',
      firstTenant.areaCode ? firstTenant.areaCode : ''
    );
    incorporationNum = firstTenant.incorporationNum ? firstTenant.incorporationNum.toString() : '';
    address = getSimpleMailingAddress(firstTenant);
    cityProvPostal = getCityProvPostal(firstTenant);
    country = firstTenant.country ? firstTenant.country : '';
  }

  return {
    dtid: data.dtid,
    fileNum: data.fileNum,
    primaryContactName: primaryContactName, // from tenantAddr
    contactName: getFullName(data.contactFirstName, data.contactMiddleName, data.contactLastName),
    orgUnit: data.orgUnit ? data.orgUnit : '',
    primaryContactEmail: primaryContactEmail, // from tenantAddr
    primaryContactPhone: primaryContactPhone, // from tenantAddr
    contactEmail: data.contactEmail ? data.contactEmail : '',
    contactPhoneNumber: data.contactPhoneNumber ? data.contactPhoneNumber : '',
    incorporationNum: incorporationNum, // from tenantAddr
    inspectionDate: formatInspectedDate(data.inspectionDate),
    type: data.type ? data.type : '',
    subType: data.subType ? data.subType : '',
    purpose: data.purpose ? data.purpose : '',
    subPurpose: data.subPurpose ? data.subPurpose : '',
    mailingAddress1: address, // address line // from tenantAddr
    mailingAddress2: cityProvPostal, // city prov postal line // from tenantAddr
    mailingAddress3: country, // country line // from tenantAddr
    locLand: data.locLand ? data.locLand : '',
    areaList: getAreaList(data.interestParcel),
    interestedParties: getInterestedParties(data.tenantAddr),
  };
};

/**
 * Misc Utility Functions
 */

/** Search Page */
function getDateTimeForFileName() {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}
