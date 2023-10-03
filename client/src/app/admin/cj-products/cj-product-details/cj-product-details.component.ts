import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../admin.service';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { Location } from '@angular/common';
@Component({
  selector: 'app-cj-product-details',
  templateUrl: './cj-product-details.component.html',
  styleUrls: ['./cj-product-details.component.scss']
})
export class CjProductDetailsComponent implements OnInit {
  product: any;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private location: Location
  ) {}

  ngOnInit() {
    this.getProductDetails();
  }

  initializeGallery() {
    this.galleryOptions = [
      {
        width: '600px',
        height: '600px',
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide
      },
      // max-width 800
      {
        breakpoint: 800,
        width: '100%',
        height: '600px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
      },
      // max-width 400
      {
        breakpoint: 400,
        preview: false
      }
    ];
    this.galleryImages = this.getImages();
  }

  getImages() {
    const imageUrls = [];
    for (const imageUrl of this.product.productImageSet) {
      imageUrls.push({
        small: imageUrl,
        medium: imageUrl,
        big: imageUrl
      });
    }
    return imageUrls;
  }

  getProductDetails() {
    const pid = this.route.snapshot.paramMap.get('pid');
    if (pid) {
      this.adminService.getPexternalroductDetails(pid).subscribe(
        (response: any) => {
          this.product = response.data;
          this.initializeGallery();
        },
        (error: any) => {
          console.error(error);
        }
      );
    }
  }
  goBack() {
    this.location.back();
  }
}