import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/admin/admin.service';

@Component({
  selector: 'app-supplier-all-orders',
  templateUrl: './supplier-all-orders.component.html',
  styleUrls: ['./supplier-all-orders.component.scss']
})
export class SupplierAllOrdersComponent implements OnInit  {
  orders: any[];
  errorMessage: string;
  pageIndex = 0;
  pageSize = 10;
  totalCount = 0;
  searchTerm = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
 
    this.getOrders();
   /*  console.log(this.getOrders());  */
  }
  searchOrders(): void {
    this.pageIndex = 0; // Reset the page index when performing a new search
    this.getOrders();
  }

  onPageChanged(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.getOrders();
  }

  resetSearch(): void {
    this.searchTerm = ''; // Clear the search term
    this.pageIndex = 0; // Reset the page index
    this.getOrders();
  }

  getOrders(): void {
    console.log('getOrders called');
    const loggedInUserId = localStorage.getItem('userId');
  
    if (loggedInUserId) {
      this.adminService
        .getAllOrdersForSupplier(loggedInUserId, this.pageIndex, this.pageSize, this.searchTerm)
        .subscribe(
          (response: any) => {
            console.log('Response from server:', response); // Add this line to log the response
            this.orders = response.orders;
            this.totalCount = response.totalCount;
            console.log(this.orders);
          },
          (error: any) => {
            this.errorMessage = error.message;
            console.error('Error in getOrders:', error);
          }
        );
    }
  }


}