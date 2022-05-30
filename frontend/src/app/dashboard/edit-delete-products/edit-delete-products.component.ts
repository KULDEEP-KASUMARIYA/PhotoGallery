import { Component, OnInit ,ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiProducts } from 'src/app/services/api.porducts';

@Component({
  selector: 'app-edit-delete-products',
  templateUrl: './edit-delete-products.component.html',
  styleUrls: ['./edit-delete-products.component.css']
})
export class EditDeleteProductsComponent implements OnInit {

  @ViewChild("closeModal") closeModal : any ;


  constructor(private proApi: ApiProducts,
    private toastr: ToastrService) { }

  productList: any;
  categoriesForm !: FormGroup;
  isSubmit: boolean = false;
  categoryError: boolean = false;
  fileTypeError: boolean = false;
  file: any;
  isFileSelected: boolean = false;
  categories: any = [
    'Mobiles', 'Laptops', "Led's", 'Electonics'
  ]



  ngOnInit(): void {
    this.categoriesForm = new FormGroup({
      'categoryName': new FormControl('', Validators.required),
      'productName': new FormControl('', [Validators.required, Validators.minLength(10)]),
      'productImage': new FormControl(''),
      'productQty': new FormControl('', [Validators.required, Validators.min(1)]),
      'productPrice': new FormControl('', [Validators.required, Validators.min(1)]),
      'hidden_id' : new FormControl(''),
      'hidden_image' : new FormControl('')
    })
    this.getProductsList()

  }


  getProductsList() {
    this.proApi.getProductApi()
      .subscribe({
        next: (res) => {
          this.productList = res
        }
      })
  }
  // validations
  get categoryName() {
    return this.categoriesForm.get('categoryName');
  }

  get productName() {
    return this.categoriesForm.get('productName');
  }

  get productImage() {
    return this.categoriesForm.get('productImage');
  }

  get productQty() {
    return this.categoriesForm.get('productQty');
  }

  get productPrice() {
    return this.categoriesForm.get('productPrice');
  }

  fileUploaded(event: any) {
    this.file = event.target.files[0];
    if (this.file === undefined) {
      this.fileTypeError = false;
      this.isFileSelected = false;
      return;
    }
    let getExt = this.file.type.split('/')[1];
    if ((getExt == 'jpg') || (getExt == 'jpeg') || (getExt == 'png')) {
      this.fileTypeError = false;
      this.isFileSelected = true;
    }
    else {
      this.fileTypeError = true;
      this.isFileSelected = false;
    }
  }


  updateProductDetails(): void {
    this.isSubmit = true;
    if (this.categoriesForm.invalid || this.fileTypeError) {
      return
    }
    else 
    {
      let formdata = new FormData();
      if (this.isFileSelected) {
        formdata.append("fileName","isSelected");
        formdata.append("productImage", this.file, this.file.name);
      }
      if (!this.isFileSelected){
        formdata.append("fileName","NotSelected");
      }
      formdata.append("catName", this.categoriesForm.value.categoryName);
      formdata.append("proName", this.categoriesForm.value.productName)
      formdata.append("proQty", this.categoriesForm.value.productQty)
      formdata.append("proPrice", this.categoriesForm.value.productPrice)
      formdata.append("hidden_id", this.categoriesForm.value.hidden_id)
      formdata.append("hidden_image", this.categoriesForm.value.hidden_image)
      this.proApi.updateProDetails(formdata)
        .subscribe({
          next: (res) => {
            if(res.status==='nModified'){
              this.closeModal.nativeElement.click();
              this.toastr.success("Product Updated Successfull","",{ timeOut: 800, progressAnimation: 'increasing' })
              this.ngOnInit();
              this.isSubmit=false;
            }
            if(res.status==='NoAnyChanges'){
              this.closeModal.nativeElement.click();
              this.toastr.warning("Please do any changes & save","",{ timeOut: 1500, progressAnimation: 'increasing' })
              this.ngOnInit();
              this.isSubmit=false;
            }
          }
        })
    }
  }

  getProductDetails(id: string): void {
    this.proApi.getProductDetails({ 'id': id })
      .subscribe({
        next: (res) => {
          this.categoriesForm.reset()
          this.categoriesForm.patchValue({
            categoryName: res.catName,
            productName: res.proName,
            productQty: res.proQty,
            productPrice: res.proPrice,
            hidden_id: res._id,
            hidden_image : res.proImage
          })
        }
      })
  }

  deleteProduct(id:any): void{
    let conf = confirm("Are You Sure ");
    if(conf){
      this.proApi.deleteProduct({'id':id})
      .subscribe({
        next : (res)=>{
          if(res.msg ==='productDeleted'){
            this.ngOnInit();
            this.toastr.success("Product deleted Successfully");
          }
        }
      })
    }
  }


}
