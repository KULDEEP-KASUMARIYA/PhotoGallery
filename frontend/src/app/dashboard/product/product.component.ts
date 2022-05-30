import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiProducts } from 'src/app/services/api.porducts';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  constructor( private proApi : ApiProducts,
    private toastr : ToastrService ) {  }

  categoriesForm !: FormGroup;
  isSubmit : boolean = false;
  categoryError : boolean = false;
  fileTypeError : boolean = false;
  file : any;
  categories : any = [
    'Mobiles','Laptops',"Led's",'Electonics'
  ]



  ngOnInit(): void {
    this.categoriesForm = new FormGroup({
      'categoryName': new FormControl('',Validators.required),
      'productName' : new FormControl('',[Validators.required,Validators.minLength(10)]),
      'productImage': new FormControl('',Validators.required),
      'productQty': new FormControl('',[Validators.required,Validators.min(1)]),
      'productPrice': new FormControl('',[Validators.required,Validators.min(1)])
    })
  }
  // validations
  get categoryName(){
    return this.categoriesForm.get('categoryName');
  }

  get productName(){
     return this.categoriesForm.get('productName');
  }

  get productImage(){
    return this.categoriesForm.get('productImage');
  }

  get productQty(){
    return this.categoriesForm.get('productQty');
  }

  get productPrice(){
    return this.categoriesForm.get('productPrice');
  }
  // get getMyValue(){
  //     let  obj = {
  //       'error':'true',
  //       'status':'false',
  //       'name':'kuldeep'
  //     }
  //     return obj;
  // }

  fileUploaded(event:any){
    this.file =   event.target.files[0];
    let getExt = this.file.type.split('/')[1];
    if((getExt == 'jpg') || (getExt=='jpeg')|| (getExt=='png')){
      this.fileTypeError = false;
    }
    else{
      this.fileTypeError = true;
    }
  }


  addCategoriesData():void{
    this.isSubmit = true;
    if(this.categoriesForm.invalid || this.fileTypeError){
      return ;
    }
    else{
      let formdata = new FormData();
      formdata.append("productImage",this.file,this.file.name);
      formdata.append("catName",this.categoriesForm.value.categoryName);
      formdata.append("proName",this.categoriesForm.value.productName)
      formdata.append("proQty",this.categoriesForm.value.productQty)
      formdata.append("proPrice",this.categoriesForm.value.productPrice)
      this.proApi.addProductApi(formdata)
      .subscribe({
        next : (res)=>{
            if(res.status==='added'){
              this.toastr.info("Product Added Successfull","",{ timeOut: 800, progressAnimation: 'increasing' })
              this.ngOnInit();
              this.isSubmit=false;
            }
        }
      })

    }
  }

  resetForm(){
    this.isSubmit =false;
  }

}
