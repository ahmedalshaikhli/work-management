import { Component, Input, OnInit } from '@angular/core';
import { Type } from 'src/app/shared/models/type';
import { ActivatedRoute, Router } from '@angular/router';
import { Brand } from 'src/app/shared/models/brand';
import { IProductToCreate, ProductFormValues } from 'src/app/shared/models/product';
import { AdminService } from '../../admin.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ShopService } from 'src/app/shop/shop.service';
@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit {
  @Input() product!: ProductFormValues;
  brands: Brand[];
  @Input() types: Type[];
  selectedPhotos: string[] = [];
  photos: { pictureUrl: string; name: string; }[];
  isEditMode: boolean;
  numberOfFiles = 0;
  public Editor = ClassicEditor as any;

  constructor(private route: ActivatedRoute, private adminService: AdminService, private router: Router,private shopService: ShopService,) {}

  ngOnInit(): void {
    this.product = {
      name: '',
      nameEn : '',
      oldPrice : 0,
      price: 0,
      description: '',
      pictureUrl: '',
      productTypeId: 0,
      productBrandId: 0,
      photos: []
    };
 
    this.loadBrands();
    this.loadTypes();
}

  onSubmit(product: IProductToCreate) {
 
      const newProduct = { ...product, price: +product.price };
      this.adminService.createProduct(newProduct, this.product.photos).subscribe((response: any) => {
        this.router.navigate(['/admin/products-list']);
      });
    
  }
 
/*   updatePrice(event: any) {
    this.product.price = event;
    this.product.oldPrice = event;
  } */


  onPhotoChange(event: any) {
    this.numberOfFiles = event.target.files.length;
    const files: FileList = event.target.files;
    this.product.photos = Array.from(files);
  
    // Empty the array for new selection.
    this.selectedPhotos = [];
  
    for (let i = 0; i < this.product.photos.length; i++) {
      const reader = new FileReader();
  
      reader.onload = (e: any) => {
        this.selectedPhotos.push(e.target.result);
      };
  
      reader.readAsDataURL(this.product.photos[i]);
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        this.selectedPhotos,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const photo = this.selectedPhotos[event.previousIndex];
      this.selectedPhotos.splice(event.previousIndex, 1);
      this.selectedPhotos.splice(event.currentIndex, 0, photo);
    }
  }
  
 
  cancelUpload(photo: string): void {
    const index = this.selectedPhotos.indexOf(photo);
    if (index !== -1) {
      this.selectedPhotos.splice(index, 1);
      // Optionally, you can also remove the file from the product.photos array
      // this.product.photos.splice(index, 1);
  
      // Decrease the number of files
      this.numberOfFiles--;
    }
  }
  loadBrands() {
    this.shopService.getBrands().subscribe((brands: Brand[]) => {
      this.brands = brands;
    });
  }

  loadTypes() {
    this.shopService.getTypes().subscribe((types: Type[]) => {
      this.types = types;
    });
  }
}