import { Component, OnInit, ViewChild } from '@angular/core';
import swal from "sweetalert2";
import { CommonService } from '../../../shared/services/common.service';
import { CityService } from '../../../shared/services/city.service';
import { City } from '../../../shared/models/city.model';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { UC } from '../../../shared/models/UC.model';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
 
@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any;

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
    if (this.filterValue.length == 0) {
      this.dataSource = new MatTableDataSource(this.dataBeforeFilter);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator.pageIndex = 0;
      this.datalength = this.countBeforeFilter;
      this.lastPageIndex = this.lastPageIndexBeforeFilter;
      return;
    }
    this.getFilteredData(filterValue.trim().toLowerCase())
  }

  searchValue() {
    this.filterValue = this.searchVal.trim();
    if (this.filterValue.length == 0) {
      this.dataSource = new MatTableDataSource(this.dataBeforeFilter);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator.pageIndex = 0;
      this.lastPageIndex = this.lastPageIndexBeforeFilter;
      this.datalength = 0;
      setTimeout(() => { this.datalength = this.countBeforeFilter; }, 200);
      return;
    }
  }

  dataSource: any;
  datalength: Number = 0;
  lastPageIndex = 0;
  dataBeforeFilter; 
  countBeforeFilter;
  lastPageIndexBeforeFilter;

  filterValue: any = "";
  ucFilterValue: any = "";
  searchVal = "";
  ucSearchVal = "";
  isCount: boolean = true;


  isEdit = false;
  city: City = new City();
  cities: City[] = [];
  ucs:UC[]=[];
  constructor(private cityService: CityService, private toaster: ToastrService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.displayedColumns = ['cityCode', 'cityName', 'desc', 'action'];
    this.getAllCities();
    //this.getAllUCs();
  }
  getAllUCs(){
    this.spinner.show();
    this.ucs = [];
    this.ucSearchVal = '';
    this.ucFilterValue = '';

    this.spinner.show();
    this.cityService.getAllUcs(this.city.citySeq, "").subscribe(res => {
      this.spinner.hide();
      this.ucs = res;
      this.ucs.forEach(element => {
        element.checked = false;
      });;
      this.getUcsForCity();
    }, error => {
      this.spinner.hide();
      console.log(error)
    })
  }
  cityUcs : any[] = [];
  openUcModal(city){
    this.city = city;
    this.ucs.forEach(element => {
      element.checked = false;
    });
    this.getAllUCs();
    
    (<any>$('#AssignLocation')).modal('show');
  }
  getUcsForCity(){
    this.cityService.getUcsForCity(this.city.citySeq).subscribe(res => {
      this.spinner.hide();
      this.cityUcs = res;
      this.cityUcs.forEach(cityuc=>{
        this.ucs.forEach(element => {
          if(cityuc.ucSeq == element.ucSeq){
            element.checked = true;
            element.cityUcRelSeq = cityuc.cityUcRelSeq;
          }
        });
      })
    }, error => {
      this.spinner.hide();
      console.log(error)
    })
  }
  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadNextPage())
      )
      .subscribe();
  }


  getAllCities() {
    this.isCount = true;
    this.spinner.show();
    this.cities = [];
    this.dataSource = new MatTableDataSource(this.cities);
    this.paginator.pageIndex = 0;
    this.lastPageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.searchVal = '';
    this.filterValue = '';

    this.cityService.getCities(this.paginator.pageIndex, 10, "",this.isCount).subscribe(res => {
      this.spinner.hide();
      this.cities = res.cities;

      this.dataSource = new MatTableDataSource(this.cities);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.datalength = res.count;
  
        this.dataBeforeFilter = this.dataSource.data;
        this.countBeforeFilter = res.count;
        this.lastPageIndexBeforeFilter = this.lastPageIndex;
    }, error => {
      this.spinner.hide();
      console.log(error)
    })
  }

  loadNextPage(){
    this.isCount = false;
    if (this.paginator.pageIndex < this.lastPageIndex)
    return
    if (this.dataSource.paginator.length == this.dataSource.data.length)
    return;
    if (((this.paginator.pageIndex + 1) * this.paginator.pageSize) - this.dataSource.data.length > 0) {
      this.spinner.show();
      this.cityService.getCities(this.paginator.pageIndex, this.paginator.pageSize, this.filterValue, this.isCount).subscribe(data => {
        this.spinner.hide();
        this.cities = data.cities;
        this.lastPageIndex = this.lastPageIndex + 1;
        this.dataSource.data = this.dataSource.data.concat(data.cities);

        data.count = this.datalength; 
        this.datalength = 0;
        setTimeout(() => { this.datalength = data.count; }, 200);

        if (this.filterValue.length == 0) {
          this.dataBeforeFilter = this.dataSource.data;
          this.countBeforeFilter = data.count;
          this.lastPageIndexBeforeFilter = this.lastPageIndex;
        }
      }, error =>{
          this.spinner.hide();
          console.log('err', error);
      });
    }
  }

  getFilteredData(filterValue:string){
    this.isCount = true;
      this.paginator.pageIndex = 0;
      this.spinner.show();
      this.cityService.getCities(this.paginator.pageIndex, this.paginator.pageSize, filterValue, this.isCount).subscribe(data => {
        this.cities = data.cities;
        this.spinner.hide();
        if (this.cities.length <= 0) {
          this.toaster.info('No Data Found Against This Search', 'Information')
        };
  
        this.dataSource = new MatTableDataSource(this.cities);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.datalength = data.count;
      }, error =>{
        this.spinner.hide();
        console.log('err', error);
        });
  }
  openCityModal() {
    (<any>$('#addprduct')).modal('show');
    this.city = new City();
    this.isEdit = false;
  }
  openCityModalToEdit(city) {
    (<any>$('#addprduct')).modal('show');
    this.city = city;
    this.isEdit = true;
  }

  addCityForm() {
    if (!this.isEdit) {
      this.spinner.show();
      this.cityService.addCity(this.city).subscribe(res => {
        this.getAllCities();
        (<any>$('#addprduct')).modal('hide');
      }, error => {
        this.spinner.hide();
        console.log(error)
      })
    } else {
      this.spinner.show();
      this.cityService.editCity(this.city).subscribe(res => {
        this.getAllCities();
        (<any>$('#addprduct')).modal('hide');
      }, error => {
        this.spinner.hide();
        console.log(error)
      })
    }
  }
  changeRadioStatus(event, uc){
    console.log(uc)
    console.log(event)
    uc.citySeq = this.city.citySeq;
    // alert(uc.checked);
    if(event.target.checked == true){
      this.cityService.addCityUcRel(uc).subscribe(res => {
        uc = res;
      });
    }else{
      this.cityService.deleteCityUcRel(uc.cityUcRelSeq).subscribe(res => {
      });
    }

  }
  deleteItem(city) {
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this city?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.cityService.deleteCity(city.citySeq).subscribe(res => {
          this.getAllCities();
          this.spinner.hide();
          swal(
            'Deleted!',
            'City has been deleted.',
            'success'
          );
        }, error => {
          this.spinner.hide();
          console.log(error)
        })
      }
    });
  }

  alphaNumeric(event: any) {
    const pattern = /[0-9a-zA-Z / ]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  showFields = false;
  showField() {
    this.showFields = true;
  }
  closeField() {
    this.showFields = false;
  }

  //Search UC
  ucShowFields = false;
  ucShowField() {
    this.ucShowFields = true;
  }
  ucCloseField() {
    this.ucShowFields = false;
  }

  ucApplyFilter(ucFilterValue: string) {
    this.ucFilterValue = ucFilterValue;
    if (this.ucFilterValue.length == 0) {
      this.getAllUCs();
      return;
    }
    this.getFilteredUcs(ucFilterValue.trim().toLowerCase())
  }

  ucSearchValue() {
    this.ucFilterValue = this.ucSearchVal.trim();
    if (this.ucFilterValue.length == 0) {
      this.getAllUCs();
      //setTimeout(() => { this.datalength = this.countBeforeFilter; }, 200);
      return;
    }
  }

  getFilteredUcs(ucFilterValue:string){
      this.spinner.show();
    this.cityService.getAllUcs(this.city.citySeq, ucFilterValue).subscribe(res => {
      this.spinner.hide();
      this.ucs = res;
      if (this.ucs.length <= 0) {
        this.toaster.info('No Data Found Against This Search', 'Information')
      };
      this.ucs.forEach(element => {
        element.checked = false;
      });
      this.getUcsForCity();
    }, error => {
      this.spinner.hide();
      console.log(error)
    })
  }
}
