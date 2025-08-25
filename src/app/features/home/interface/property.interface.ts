export interface IProperty {
  id: number;
  title: string;
  description: string;
  ownerName: string;
  type: PropertyType;
  isShared: boolean;
  location: string;
  size: string;
  leaseType: LeaseType;
  expectedRent: number;
  priceMode: PriceMode;
  isFurnished: boolean;
  amenities: Array<number>;
  images: Array<string>;
  ownerId: number;
  featured?: boolean;
  isFavorited?: boolean;
}

export enum PropertyType {
  Apartment = 0,
  Villa = 1,
  Studio = 2,
  OneBhk = 3,
  TwoBhk = 4,
  ThreeBhk = 5,
}

export enum LeaseType {
  Monthly = 0,
  Yearly = 1,
  ShortTerm = 2,
}

export enum PriceMode {
  'Fixed Price' = 0,
  Negotiable = 1,
}

export interface IPropertyFilter {
  type?: IProperty['type'] | null;
  isFurnished?: IProperty['isFurnished'] | null;
  priceMode?: IProperty['priceMode'] | null;
  ownerId?: IProperty['ownerId'] | null 
}
