'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import ReactCountryFlag from 'react-country-flag';

export const COUNTRY_CODES = [
  "AF","AX","AL","DZ","AS","AD","AO","AI","AQ","AG","AR","AM","AW","AU","AT","AZ","BS","BH","BD","BB","BY","BE","BZ","BJ","BM","BT","BO","BQ","BA","BW","BV","BR","IO","BN","BG","BF","BI","CV","KH","CM","CA","KY","CF","TD","CL","CN","CX","CC","CO","KM","CG","CD","CK","CR","CI","HR","CU","CW","CY","CZ","DK","DJ","DM","DO","EC","EG","SV","GQ","ER","EE","SZ","ET","FK","FO","FJ","FI","FR","GF","PF","TF","GA","GM","GE","DE","GH","GI","GR","GL","GD","GP","GU","GT","GG","GN","GW","GY","HT","HM","VA","HN","HK","HU","IS","IN","ID","IR","IQ","IE","IM","IL","IT","JM","JP","JE","JO","KZ","KE","KI","KP","KR","KW","KG","LA","LV","LB","LS","LR","LY","LI","LT","LU","MO","MG","MW","MY","MV","ML","MT","MH","MQ","MR","MU","YT","MX","FM","MD","MC","MN","ME","MS","MA","MZ","MM","NA","NR","NP","NL","NC","NZ","NI","NE","NG","NU","NF","MK","MP","NO","OM","PK","PW","PS","PA","PG","PY","PE","PH","PN","PL","PT","PR","QA","RE","RO","RU","RW","BL","SH","KN","LC","MF","PM","VC","WS","SM","ST","SA","SN","RS","SC","SL","SG","SX","SK","SI","SB","SO","ZA","GS","SS","ES","LK","SD","SR","SJ","SE","CH","SY","TW","TJ","TZ","TH","TL","TG","TK","TO","TT","TN","TR","TM","TC","TV","UG","UA","AE","GB","US","UM","UY","UZ","VU","VE","VN","VG","VI","WF","EH","YE","ZM","ZW"
];

export interface CountryOption {
  code: string;
  name: string;
}

interface CountrySelectProps {
  fieldName: string;
  placeholder: string;
  value: string;
  locale: string;
  hasError?: boolean;
  /** Override trigger button style — for dark backgrounds */
  triggerClassName?: string;
  /** Override placeholder text color */
  placeholderColor?: string;
  onChange: (countryName: string) => void;
}

const defaultTrigger =
  'w-full border px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors rounded-sm flex items-center cursor-pointer select-none';

export default function CountrySelect({
  fieldName,
  placeholder,
  value,
  locale,
  hasError = false,
  triggerClassName,
  placeholderColor = 'text-gray-500',
  onChange,
}: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const localizedCountries: CountryOption[] = useMemo(() => {
    const regionNames = new Intl.DisplayNames([locale], { type: 'region' });
    return COUNTRY_CODES.map((code) => ({
      code,
      name: regionNames.of(code) || code,
    })).sort((a, b) => a.name.localeCompare(b.name, locale));
  }, [locale]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCountry = localizedCountries.find((c) => c.name === value);
  const borderCls = hasError ? 'border-red-500' : 'border-gray-300';
  const triggerCls = triggerClassName ?? `${defaultTrigger} ${borderCls}`;

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div id={`country-${fieldName}`} onClick={() => setIsOpen(!isOpen)} className={triggerCls}>
        {selectedCountry ? (
          <>
            <ReactCountryFlag countryCode={selectedCountry.code} svg className="mr-3 text-lg shrink-0" />
            <span className="truncate text-sm">{selectedCountry.name}</span>
          </>
        ) : (
          <span className={`text-sm ${placeholderColor}`}>{placeholder}</span>
        )}
        <div className="ml-auto pointer-events-none">
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-sm shadow-lg max-h-60 overflow-y-auto">
          {localizedCountries.map((country) => (
            <li
              key={country.code}
              className={`px-3 py-2.5 flex items-center cursor-pointer transition-colors hover:bg-gray-100 ${
                value === country.name ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
              onClick={() => { onChange(country.name); setIsOpen(false); }}
            >
              <ReactCountryFlag countryCode={country.code} svg className="mr-3 text-lg shrink-0" />
              <span className="text-sm">{country.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}