export const COUNTRIES_LIST = [
  'India',
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Sweden',
  'Germany',
  'United Arab Emirates',
  'Singapore'
];

export interface LocationHierarchy {
  states: Record<string, string[]>;
  pinPlaceholder: string;
}

export const COUNTRY_LOCATION_DATA: Record<string, LocationHierarchy> = {
  'India': {
    pinPlaceholder: 'e.g. 400001 (6 digits)',
    states: {
      'Maharashtra': ['Mumbai', 'Pune', 'Navi Mumbai', 'Thane', 'Nagpur', 'Nashik'],
      'Delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'],
      'Karnataka': ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi'],
      'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'],
      'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli'],
      'West Bengal': ['Kolkata', 'Howrah', 'Siliguri', 'Durgapur'],
      'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
      'Rajasthan': ['Jaipur', 'Udaipur', 'Jodhpur', 'Kota', 'Bikaner'],
      'Uttar Pradesh': ['Noida', 'Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Ghaziabad'],
      'Punjab & Haryana': ['Chandigarh', 'Gurugram', 'Ludhiana', 'Amritsar', 'Faridabad'],
      'Kerala': ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur'],
      'Madhya Pradesh': ['Indore', 'Bhopal', 'Gwalior', 'Jabalpur'],
      'Goa': ['Panaji', 'Margao', 'Vasco da Gama']
    }
  },
  'Sweden': {
    pinPlaceholder: 'e.g. 111 22',
    states: {
      'Stockholm County': ['Stockholm', 'Södertälje', 'Täby', 'Solna'],
      'Västra Götaland': ['Gothenburg', 'Borås', 'Trollhättan', 'Skövde'],
      'Skåne': ['Malmö', 'Helsingborg', 'Lund', 'Kristianstad'],
      'Uppsala County': ['Uppsala', 'Enköping', 'Östhammar']
    }
  },
  'United States': {
    pinPlaceholder: 'e.g. 90210 (ZIP Code)',
    states: {
      'California': ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose'],
      'New York': ['New York City', 'Buffalo', 'Albany', 'Rochester'],
      'Texas': ['Austin', 'Houston', 'Dallas', 'San Antonio'],
      'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville'],
      'Illinois': ['Chicago', 'Aurora', 'Naperville'],
      'Washington': ['Seattle', 'Spokane', 'Tacoma']
    }
  },
  'United Kingdom': {
    pinPlaceholder: 'e.g. SW1A 1AA (Postal Code)',
    states: {
      'Greater London': ['London', 'Croydon', 'Westminster'],
      'Greater Manchester': ['Manchester', 'Salford', 'Bolton'],
      'West Midlands': ['Birmingham', 'Coventry', 'Wolverhampton'],
      'Scotland': ['Edinburgh', 'Glasgow', 'Aberdeen']
    }
  },
  'Canada': {
    pinPlaceholder: 'e.g. M5V 2T6',
    states: {
      'Ontario': ['Toronto', 'Ottawa', 'Hamilton', 'Mississauga'],
      'Quebec': ['Montreal', 'Quebec City', 'Laval'],
      'British Columbia': ['Vancouver', 'Victoria', 'Surrey'],
      'Alberta': ['Calgary', 'Edmonton', 'Red Deer']
    }
  },
  'Australia': {
    pinPlaceholder: 'e.g. 2000',
    states: {
      'New South Wales': ['Sydney', 'Newcastle', 'Wollongong'],
      'Victoria': ['Melbourne', 'Geelong', 'Ballarat'],
      'Queensland': ['Brisbane', 'Gold Coast', 'Cairns'],
      'Western Australia': ['Perth', 'Fremantle', 'Mandurah']
    }
  },
  'Germany': {
    pinPlaceholder: 'e.g. 80331',
    states: {
      'Bavaria': ['Munich', 'Nuremberg', 'Augsburg'],
      'Berlin': ['Berlin'],
      'North Rhine-Westphalia': ['Cologne', 'Düsseldorf', 'Dortmund'],
      'Hesse': ['Frankfurt', 'Wiesbaden', 'Kassel']
    }
  },
  'United Arab Emirates': {
    pinPlaceholder: 'e.g. 00000',
    states: {
      'Dubai': ['Dubai City'],
      'Abu Dhabi': ['Abu Dhabi City', 'Al Ain'],
      'Sharjah': ['Sharjah City'],
      'Ajman': ['Ajman City']
    }
  },
  'Singapore': {
    pinPlaceholder: 'e.g. 018989',
    states: {
      'Central Region': ['Singapore']
    }
  }
};

export const PIN_CODE_EXACT_MAP: Record<string, { city: string; state: string; country: string }> = {
  '110001': { city: 'New Delhi', state: 'Delhi', country: 'India' },
  '110002': { city: 'New Delhi', state: 'Delhi', country: 'India' },
  '400001': { city: 'Mumbai', state: 'Maharashtra', country: 'India' },
  '400002': { city: 'Mumbai', state: 'Maharashtra', country: 'India' },
  '411001': { city: 'Pune', state: 'Maharashtra', country: 'India' },
  '400703': { city: 'Navi Mumbai', state: 'Maharashtra', country: 'India' },
  '560001': { city: 'Bengaluru', state: 'Karnataka', country: 'India' },
  '560002': { city: 'Bengaluru', state: 'Karnataka', country: 'India' },
  '500001': { city: 'Hyderabad', state: 'Telangana', country: 'India' },
  '600001': { city: 'Chennai', state: 'Tamil Nadu', country: 'India' },
  '700001': { city: 'Kolkata', state: 'West Bengal', country: 'India' },
  '380001': { city: 'Ahmedabad', state: 'Gujarat', country: 'India' },
  '395001': { city: 'Surat', state: 'Gujarat', country: 'India' },
  '302001': { city: 'Jaipur', state: 'Rajasthan', country: 'India' },
  '226001': { city: 'Lucknow', state: 'Uttar Pradesh', country: 'India' },
  '201301': { city: 'Noida', state: 'Uttar Pradesh', country: 'India' },
  '122001': { city: 'Gurugram', state: 'Punjab & Haryana', country: 'India' },
  '160017': { city: 'Chandigarh', state: 'Punjab & Haryana', country: 'India' },
  '682001': { city: 'Kochi', state: 'Kerala', country: 'India' },
  '452001': { city: 'Indore', state: 'Madhya Pradesh', country: 'India' }
};

export const lookupPinCode = (pin: string): { city: string; state: string; country: string } | null => {
  const cleanPin = pin.trim().replace(/\s+/g, '');
  if (!cleanPin) return null;

  // 1. Check exact map lookup
  if (PIN_CODE_EXACT_MAP[cleanPin]) {
    return PIN_CODE_EXACT_MAP[cleanPin];
  }

  // 2. Check 6-digit Indian PIN Code Prefix rules for instant auto-fill
  if (/^\d{6}$/.test(cleanPin)) {
    const prefix = cleanPin.substring(0, 3);
    const firstDigit = cleanPin.charAt(0);

    if (prefix === '110') return { city: 'New Delhi', state: 'Delhi', country: 'India' };
    if (prefix === '400') return { city: 'Mumbai', state: 'Maharashtra', country: 'India' };
    if (prefix === '411') return { city: 'Pune', state: 'Maharashtra', country: 'India' };
    if (prefix === '560') return { city: 'Bengaluru', state: 'Karnataka', country: 'India' };
    if (prefix === '500') return { city: 'Hyderabad', state: 'Telangana', country: 'India' };
    if (prefix === '600') return { city: 'Chennai', state: 'Tamil Nadu', country: 'India' };
    if (prefix === '700') return { city: 'Kolkata', state: 'West Bengal', country: 'India' };
    if (prefix === '380') return { city: 'Ahmedabad', state: 'Gujarat', country: 'India' };
    if (prefix === '395') return { city: 'Surat', state: 'Gujarat', country: 'India' };
    if (prefix === '302') return { city: 'Jaipur', state: 'Rajasthan', country: 'India' };
    if (prefix === '226') return { city: 'Lucknow', state: 'Uttar Pradesh', country: 'India' };
    if (prefix === '201') return { city: 'Noida', state: 'Uttar Pradesh', country: 'India' };
    if (prefix === '122') return { city: 'Gurugram', state: 'Punjab & Haryana', country: 'India' };
    if (prefix === '160') return { city: 'Chandigarh', state: 'Punjab & Haryana', country: 'India' };
    if (prefix === '682') return { city: 'Kochi', state: 'Kerala', country: 'India' };
    if (prefix === '452') return { city: 'Indore', state: 'Madhya Pradesh', country: 'India' };

    // General state routing by first digit
    if (firstDigit === '1') return { city: 'New Delhi', state: 'Delhi', country: 'India' };
    if (firstDigit === '4') return { city: 'Mumbai', state: 'Maharashtra', country: 'India' };
    if (firstDigit === '5') return { city: 'Bengaluru', state: 'Karnataka', country: 'India' };
    if (firstDigit === '6') return { city: 'Chennai', state: 'Tamil Nadu', country: 'India' };
    if (firstDigit === '7') return { city: 'Kolkata', state: 'West Bengal', country: 'India' };
    if (firstDigit === '3') return { city: 'Ahmedabad', state: 'Gujarat', country: 'India' };
    if (firstDigit === '2') return { city: 'Noida', state: 'Uttar Pradesh', country: 'India' };
  }

  return null;
};
