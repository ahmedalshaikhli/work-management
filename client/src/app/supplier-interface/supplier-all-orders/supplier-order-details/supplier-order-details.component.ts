import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/admin/admin.service';

@Component({
  selector: 'app-supplier-order-details',
  templateUrl: './supplier-order-details.component.html',
  styleUrls: ['./supplier-order-details.component.scss']
})
export class SupplierOrderDetailsComponent implements OnInit {
  buyerEmail: string;
  order: any;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private router: Router
   
  ) {}

  ngOnInit(): void {
    this.buyerEmail= this.route.snapshot.paramMap.get('email');
    this.getUserDetails();
  }
 

  getUserDetails(): void {
    this.adminService.getUserOrderByEmail(this.buyerEmail).subscribe((order) => {
      this.order = order;
      console.log(this.order);
    },
    (error: any) => {
      console.error(error);
    }
    );
  }

  goBack() {
    this.router.navigate(['/supplier/supplier-all-orders']); // Replace '/' with the appropriate route for your previous page
  }

 
}