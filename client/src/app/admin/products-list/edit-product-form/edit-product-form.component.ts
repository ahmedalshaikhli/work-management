

import { Component, Input, OnInit } from '@angular/core';

import { Type } from 'src/app/shared/models/type';
import { ActivatedRoute, Router } from '@angular/router';
import { Brand } from 'src/app/shared/models/brand';
import { ProductFormValues } from 'src/app/shared/models/product';
import { AdminService } from '../../admin.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ShopService } from 'src/app/shop/shop.service';
import { forkJoin } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-edit-product-form',
  templateUrl: './edit-product-form.component.html',
  styleUrls: ['./edit-product-form.component.scss']
})
export class EditProductFormComponent implements OnInit {
product: ProductFormValues;
brands: Brand[];
 types: Type[];
  selectedPhotos: string[] = [];
  photos: { pictureUrl: string; name: string; isMain: boolean;}[];
  isEditMode: boolean;
  combinedPhotos: (string | { file?: File; url: string })[] = [];
  isPhotoObject(photo: any): photo is { file?: File; url: string } {
    return typeof photo === 'object';
  }
  public Editor = ClassicEditor as any;

  constructor(private route: ActivatedRoute, private adminService: AdminService, private router: Router,private shopService: ShopService)
   { 
    this.product = new ProductFormValues();
  }

  ngOnInit(): void {
    this.product = {
      name: '',
      nameEn : '',
      oldPrice : 0,
      description: '',
      price: 0,
      pictureUrl: '',
      productTypeId: 0,
      productBrandId: 0,
      photos: []
    };
  
    const brands = this.getBrands();
    const types = this.getTypes();
  
    forkJoin([types, brands]).subscribe(results => {
      this.types = results[0];
      this.brands = results[1];
    }, error => {
      console.log(error);
    }, () => {
      // Update the condition to check if the correct path is present in the route snapshot
      if (this.route.snapshot.url.some(segment => segment.path === 'edit')) {
        this.loadProduct();
      }
    });
  }



  onSubmit(productForm: NgForm) {
    if (productForm.valid) {
      const updatedProduct = { ...this.product };
      console.log('Submitted Product:', updatedProduct); // Add this line to log the submitted product
      const productId = +this.route.snapshot.paramMap.get('id');
      this.adminService.updateProduct(productId, updatedProduct).subscribe(
        (response: any) => {
          this.router.navigate(['/admin/products-list']);
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }
  getPhotoUrl(photo: any): {url: string, id: number} {
    return {
      url:  photo.pictureUrl,
      id: photo.id,
      
    };
  }
  updatePrice(event: any) {
    this.product.price = event;
  }


  onPhotoChange(event: any) {
    const newPhotos: FileList = event.target.files;
  
    for (let i = 0; i < newPhotos.length; i++) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.combinedPhotos.push({file: newPhotos[i], url: e.target.result as string});
        if (i === 0) {
          this.product.pictureUrl = e.target.result as string; // set pictureUrl to the first image
        }
      };
      reader.readAsDataURL(newPhotos[i]);
    }
  
    // Append new photos to existing photos
    this.product.photos = [...this.product.photos, ...Array.from(newPhotos)];
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.combinedPhotos, event.previousIndex, event.currentIndex);
   /*  this.setMainPhoto(); */
  
    console.log('Photo indexes after drag and drop:');
    this.combinedPhotos.forEach((photo, index) => {
      console.log(`Index: ${index}, Photo:`, photo);
    });
  }


cancelUpload(photo: any): void {
  console.log('cancelUpload function called with photo:', photo);

  let index = this.combinedPhotos.indexOf(photo);
  if (index !== -1) {
    this.combinedPhotos.splice(index, 1);

    // If it's not a File object
      console.log('o:', photo);
      this.adminService.deletePhoto(photo.id).subscribe(  // Use photo.id here
        () => {
          console.log('Photo deleted successfully');
        },
        (error: any) => {
          console.log('Error deleting photo:', error);
        }
      );
    
  }
}

  loadProduct() {
    const id = this.route.snapshot.paramMap.get('id');
    id && this.shopService.getProduct(+id).subscribe((response: any) => {
      const productBrandId = this.brands && this.brands.find(x => x.name === response.productBrand).id;
      const productTypeId = this.types && this.types.find(x => x.name === response.productType).id;
      this.product = response;
      this.product = {...response, productBrandId, productTypeId};
  
      // Add existing photos to combinedPhotos
      this.combinedPhotos = this.product.photos.map(photo => this.getPhotoUrl(photo));
  
      console.log('Loaded Product:', this.product); // Add this line to log the loaded product
    });
  }
getBrands() {
  return this.shopService.getBrands();
}

getTypes() {
  return this.shopService.getTypes();
}
}