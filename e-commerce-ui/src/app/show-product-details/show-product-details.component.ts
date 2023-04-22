import { ImageProcessingService } from './../image-processing.service';
import { ProductService } from './../_services/product.service';
import { Product } from './../_model/product.model';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ShowProductImagesDialogComponent } from '../show-product-images-dialog/show-product-images-dialog.component';
import { map } from 'rxjs';

@Component({
  selector: 'app-show-product-details',
  templateUrl: './show-product-details.component.html',
  styleUrls: ['./show-product-details.component.css']
})
export class ShowProductDetailsComponent implements OnInit  {


  productDetails: Product[] = [];



  displayedColumns: string[] = ['Id', 'Product Name', 'Product Description', 'Product Discounted Price' , 'Product Actual Price' ,'Images', 'Edit' , 'Delete'];
  constructor(private productService: ProductService , public imagesDialog : MatDialog , private imageProcessingService:ImageProcessingService){}

  ngOnInit(): void {
      this.getProductDetails();
  }

  public getProductDetails(){
    this.productService.getAllProducts()
    .pipe(
      map((x: Product[] , i) =>x.map((product:Product) => this.imageProcessingService.createImages(product)))
    )
    .subscribe(
      (resp: Product[]) =>{
        console.log(resp);
        this.productDetails = resp;
      },(error : HttpErrorResponse) =>{
        console.log(error);
      }
    );
  }

  deleteProduct(productId){
    this.productService.deleteProduct(productId).subscribe(
      (resp)=>{
        console.log(resp);
        this.getProductDetails();
      },
      (error:HttpErrorResponse) =>{
        console.log(error);
      }
    );

  }

  showImages(product : Product){
    console.log(product);
    this.imagesDialog.open(ShowProductImagesDialogComponent , {
      data:{
        images: product.productImages
      },
      height: '500Px',
      width:'700px'
    });

  }
}
