import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../../shared/services/product.service';
import { Router } from '@angular/router';
import { Product } from '../../../../../shared/models/Product.model';
import { RecipeProvider } from '../../../../../shared/providers/recipe';
import { BreadcrumbProvider } from '../../../../../shared/providers/breadcrumb';
import { AccountingSetup, AdjustmnentSequence } from '../../../../../shared/models/FormAssignment.model';

@Component({
  selector: 'app-adjustment-sequence',
  templateUrl: './adjustment-sequence.component.html',
  styleUrls: ['./adjustment-sequence.component.css']
})
export class AdjustmentSequenceComponent implements OnInit {
  product: Product;
  private isEdit: string;
  private chargeTypes: any[] = [];
  allAdjustments: AdjustmnentSequence[] = [];
  allitems: any[] = [];
  constructor(private productService: ProductService,
    private router: Router,
    private breadcrumbProvider: BreadcrumbProvider) { }

  ngOnInit() {
    this.isEdit = sessionStorage.getItem('isProductEdit');
    this.product = JSON.parse(sessionStorage.getItem('product'));
    console.log(this.product)
    if(this.product.prdTypKey != 1165){
      this.breadcrumbProvider.addItem('Associate Product', '/setup/addProduct/associate-product-assignment');
    }
    this.loadBasic();
  }

  onSubmit() {
    // if (this.isEdit === 'true') {
    this.allitems.forEach((type, index) => {
      console.log(type)
      const adjustment = new AdjustmnentSequence();
      adjustment.adjOrdr = type.adjOrdr;
      adjustment.prdSeq = this.product.productSeq;
      adjustment.prdChrgSeq = type.prdChrgSeq;
      adjustment.prdChrgAdjOrdrSeq = type.prdChrgAdjOrdrSeq;
      if (type.prdChrgAdjOrdrSeq != undefined) {
        this.productService.updateAdjustmentSequence(adjustment).subscribe();
      } else {
        this.productService.addAdjustmentSequence(adjustment).subscribe(res => {
          type.prdChrgAdjOrdrSeq = res.PrdChrgAdjOrdr.prdChrgAdjOrdrSeq;
        });
      }
    });
    // } else {
    //   this.allitems.forEach((type, index) => {
    //     console.log(type)
    //     const adjustment = new AdjustmnentSequence();
    //     adjustment.adjOrdr = index;
    //     adjustment.prdSeq = this.product.productSeq;
    //     adjustment.prdChrgSeq = type.prdChrgSeq;
    //     this.productService.addAdjustmentSequence(adjustment).subscribe(res => {
    //       type.prdChrgAdjOrdrSeq = res.PrdChrgAdjOrdr.prdChrgAdjOrdrSeq;
    //     });
    //   });
    // }
  }

  onTop() {
    this.allitems.unshift(this.allitems.pop());
  }

  onBottom() {
    this.allitems.push(this.allitems.shift());
  }
  index = [];indexorig = [];
  allFormsAssignmentSelected;
  private loadBasic() {
    this.productService.getChargesTypes().subscribe(typs => {
      this.chargeTypes = typs;
      // if (this.isEdit === 'true') {
      if (this.product.productSeq != undefined) {
        this.productService.getAllAdjustmentSequencesBySeq(this.product.productSeq).subscribe((adbyseq) => {
          this.allAdjustments = adbyseq;
          console.log(this.allAdjustments)
          if (this.allAdjustments.length) {
            this.productService.getAllCharges(this.product.productSeq).subscribe(d => {
              var index = -1;
              d.forEach((item,i) => {
                typs.forEach(element => {
                  if(item.chrgTypSeq == element.typSeq){
                    if(element.typStr.indexOf("SERVICE CHARGES")>=0){
                      index = i;
                    }
                  }
                });
              })
              if(index>=0){
                d.splice(index+1, 0, { prdChrgSeq: -1, prdSeq: this.product.productSeq, chargeName: "PRINCIPAL AMOUNT" });
              }
              console.log(this.allitems)
              this.productService.getAllFormsAssignments().subscribe(forms => {
                this.productService.getAllFormsAssignmentsBySeq(this.product.productSeq).subscribe(s => {

                  // forms.forEach(element => {
                  //   s.forEach(ele => {
                  //     // if (element.)
                  //     if (element.formSeq == ele.formSeq) {
                  //       if (element.formNm.indexOf("Insurance") >= 0) {
                  //         this.allitems.push({ prdChrgSeq: 9991, prdSeq: this.product.productSeq, chargeName: "KSZB" })
                  //       }deleteAdjustmentSequence
                  //     }
                  //   });
                  // });

                  var inx = -1;
                  forms.forEach(element => {
                    s.forEach(ele => {
                      // if (element.)
                      if (element.formSeq == ele.formSeq) {
                        if (element.formNm.indexOf("Insurance") >= 0) {
                          inx = 2;
                          d.push({ prdChrgSeq: -2, prdSeq: this.product.productSeq, chargeName: "KSZB" })
                        }
                      }
                    });
                  });
                  var hasIns = false;
                  this.allAdjustments.forEach(element => {
                    if(element.prdChrgSeq == -2){
                      hasIns = true;
                      if(inx<0){
                        this.productService.deleteAdjustmentSequence(element.prdChrgAdjOrdrSeq).subscribe();
                      }
                    }
                    if(element.prdChrgSeq == -1){

                    }
                    d.forEach(item => {
                      if (item.prdChrgSeq == element.prdChrgSeq) {
                        item.prdChrgAdjOrdrSeq = element.prdChrgAdjOrdrSeq;
                        item.adjOrdr = element.adjOrdr;
                      }
                    })
                  });
                  console.log(d)
                  var i = 0;
                  d.forEach(item => {
                    i++;
                    this.index.push(i);
                    this.indexorig.push(i);
                  });
                  this.allitems = d;
                })
              })
            });
            // this.allAdjustments.forEach(ad => {
            //   i++;
            //   this.index.push(i)
            //   // const itemIndex = this.chargeTypes.findIndex(item => item.typSeq === ad.prdChrgSeq);
            //   // this.allitems.push({
            //   //   typSeq: ad.prdChrgSeq, glAcctNum: this.chargeTypes[itemIndex].glAcctNum,
            //   //   prdChrgAdjOrdrSeq: ad.prdChrgAdjOrdrSeq
            //   // });
            // });
          } else {
            
            var i = 0;
            this.productService.getAllCharges(this.product.productSeq).subscribe(d => {
              var index = -1;
              d.forEach((item,i) => {
                typs.forEach(element => {
                  if(item.chrgTypSeq == element.typSeq){
                    if(element.typStr.indexOf("SERVICE CHARGES")>=0){
                      index = i;
                    }
                  }
                });
              })
              if(index>=0){
                d.splice(index+1, 0, { prdChrgSeq: -1, prdSeq: this.product.productSeq, chargeName: "PRINCIPAL AMOUNT" });
              }
              this.productService.getAllFormsAssignments().subscribe(forms => {
                this.productService.getAllFormsAssignmentsBySeq(this.product.productSeq).subscribe(s => {
                  this.allFormsAssignmentSelected = s;
                  console.log(this.allFormsAssignmentSelected);
                  this.allitems = d;
                  // s.forEach(element => {
                    var index = -1;
                  forms.forEach(element => {
                    s.forEach(ele => {
                      // if (element.)
                      if (element.formSeq == ele.formSeq) {
                        if (element.formNm.indexOf("Insurance") >= 0) {
                          index = 2;
                          this.allitems.push({ "prdChrgSeq": -2, "prdSeq": this.product.productSeq, chargeName: "KSZB" })
                        }
                      }
                    });
                  });
                  // });

                  d.forEach(item => {
                    i++;
                    this.index.push(i);
                    if(item.chrgTypSeq == -2){

                    }
                  })
                  console.log(this.allitems)
                });


              });
            });
          }
          console.log(this.index)
        });
        // } else {
        //   this.productService.getAllCharges(this.product.productSeq).subscribe(d => {
        //     this.allitems = d; console.log(this.allitems)
        //   });
      }
    });
  }
  orderSelect(i){
    console.log(i);
    this.allitems.forEach(item => {
      var ind = -1;
      if (item.adjOrdr) {
        this.index.forEach((item2,index) => {
          if(item2 == item.adjOrdr){
            ind = index;
          }
        })
      }
      if(ind>=0){
        this.index.splice(ind,1)
      }
    })
  }
}
