import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AdminService } from 'src/app/admin/admin.service';
import { IProduct } from 'src/app/shared/models/product';
import { ShopParams } from 'src/app/shared/models/shopParams';
import { ShopService } from 'src/app/shop/shop.service';

@Component({
  selector: 'app-supplier-products-list',
  templateUrl: './supplier-products-list.component.html',
  styleUrls: ['./supplier-products-list.component.scss']
})
export class SupplierProductsListComponent  implements OnInit {
  products !: IProduct[];
  totalCount !: number;
  shopParams: ShopParams;
  @ViewChild('search') searchTerm?: ElementRef;
  constructor(private shopService: ShopService, private adminService: AdminService) {
    this.shopParams = this.shopService.getShopParams();
  }

  ngOnInit() {
    const loggedInUserId = localStorage.getItem('userId');

    if (loggedInUserId) {
      this.adminService.getSupplierProducts(loggedInUserId).subscribe(
        (response: any) => {
          this.products = response.data;
          this.totalCount = response.count;
        },
        error => {
          console.log(error);
          // handle the error
        }
      );
    }
  }



/*   onPageChanged(event: any) {
    const params = this.shopService.getShopParams();
    if (params.pageNumber !== event) {
      params.pageNumber = event;
      this.shopService.setShopParams(params);
      this.getProducts(true);
    }
  } */

  deleteProduct(id: number) {
    this.adminService.deleteProduct(id).subscribe((response: any) => {
      this.products.splice(this.products.findIndex(p => p.id === id), 1);
      this.totalCount--;
    });
  }
  
/*   onSearch() {
    const params = this.shopService.getShopParams();
    params.search = this.searchTerm?.nativeElement.value;
    params.pageNumber = 1;
    this.shopService.setShopParams(params);
    this.shopParams = params;
    this.getProducts();
  } */
}