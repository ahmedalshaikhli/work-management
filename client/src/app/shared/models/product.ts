export interface IProduct {
  id: number;
  nameEn: string;
  name: string;
  oldPrice: number;
  description: string;
  price: number;
  pictureUrl: string;
  productType: string;
  productBrand: string;

  creatorName: string;
  photos: IPhoto[];
}
export interface IPhoto {
  id: number;
  pictureUrl: string;
  fileName: string;
  isMain: boolean;
  url?: string;
}

export interface IProductToCreate {
  name: string;
  nameEn: string;
  oldPrice: number;
  description: string;
  price: number;
  pictureUrl: string;
  productTypeId: number;
  productBrandId: number;
  photos: File[];
}
export class ProductFormValues implements IProductToCreate {
  name = '';
  nameEn : '';
  oldPrice : 0;
  description = '';
  price: number = 0;
  pictureUrl = '';
  productBrandId!: number;
  productTypeId!: number;
  photos: File[] = [];
  

  constructor(init?: ProductFormValues) {
    Object.assign(this, init);
  }
}

