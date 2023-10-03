import { Component, OnInit } from '@angular/core';
import { ProductExternal } from 'src/app/shared/models/ProductExternal';
import { AdminService } from '../admin.service';
import { PaginatedResult } from 'src/app/shared/models/PaginatedResult';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cj-products',
  templateUrl: './cj-products.component.html',
  styleUrls: ['./cj-products.component.scss']
})
export class CJProductsComponent implements OnInit {
  pageSize = 20;
  pageNum = 1;
  products: ProductExternal[] = [];
  totalPages = 0;
  searchQuery: string = ''; // Single input field for both pid and searchTerm
  pid: string = ''; 

  constructor(private adminService: AdminService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadProducts();
  }


  loadProducts(): void {
    this.adminService.getExternalProducts(this.pageSize, this.pageNum, this.searchQuery)
      .subscribe((result: PaginatedResult<ProductExternal>) => {
        this.products = result.data;
        this.totalPages = result.totalPages;
      });
  }

  searchProducts(): void {
    this.pageNum = 1; // Reset page number to 1 when performing a new search
    this.loadProducts();
  }
  resetSearch(): void {
    this.searchQuery = ''; // Clear the search input
    this.searchProducts(); // Perform a new search with an empty searchValue
  }


  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageNum = page;
      this.loadProducts();
    }
  }

  nextPage(): void {
    if (this.pageNum < this.totalPages) {
      this.pageNum++;
      this.loadProducts();
    }
  }

  previousPage(): void {
    if (this.pageNum > 1) {
      this.pageNum--;
      this.loadProducts();
    }
  }

  showProductDetails(productId: string) {
    this.adminService.getPexternalroductDetails(productId)
      .subscribe((productDetails: any) => {
        // Handle the product details here (e.g., display in a modal, navigate to a product details page)
        console.log(productDetails);
      }, error => {
        console.log(error);
      });
  }

  saveProductFromExternal(pid: string) {
    this.adminService.saveProductFromExternal(pid)
      .subscribe(() => {
        this.toastr.success('تم اضافة المنتج بنجاح');
      }, error => {
        this.toastr.error('Error occurred when saving product: ' + error);
      });
  }
}