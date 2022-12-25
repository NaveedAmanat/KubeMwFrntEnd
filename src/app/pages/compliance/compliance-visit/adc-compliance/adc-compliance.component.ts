import { Component, OnInit, ViewChild } from '@angular/core';
import { ComplianceService } from 'src/app/shared/services/compliance.service';
import { MatPaginator, MatSort, MatTableDataSource,MatTableModule   } from '@angular/material';

@Component({
  selector: 'app-adc-compliance',
  templateUrl: './adc-compliance.component.html',
  styleUrls: ['./adc-compliance.component.css']
})
export class AdcComplianceComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any;
  listing: any;
  dataSource: any;
  constructor(private complianceService: ComplianceService){}
  vst: any;
  ngOnInit() {
    this.vst = JSON.parse(localStorage.getItem("vst"));
    this.displayedColumns = ['qstStrng','answrStrng','cmnt'];
    this.complianceService.getAdcVstData(this.vst.adtVstSeq).subscribe(res => {
      this.listing = res;
      this.dataSource = new MatTableDataSource(this.listing);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

}