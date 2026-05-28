export type Address = {
  id: string;
  userId: string;
  label: string;
  recipientName: string;
  recipientPhone: string;
  detail: string;
  rajaongkirId: string;
  rajaongkirLabel: string;
  provinceName: string;
  cityName: string;
  districtName: string;
  subdistrictName?: string | null;
  zipCode?: string | null;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
};

export type RajaOngkirDestination = {
  id: number;
  label: string;
  province_name: string;
  city_name: string;
  district_name: string;
  subdistrict_name?: string;
  zip_code?: string;
};

export type ShippingOption = {
  name: string;
  code: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
};
