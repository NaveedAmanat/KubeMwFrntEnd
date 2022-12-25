import { Component, OnInit, ViewChild } from '@angular/core';
import { ComplianceService } from 'src/app/shared/services/compliance.service';
import { MatPaginator, MatSort, MatTableDataSource,MatTableModule   } from '@angular/material';


@Component({
  selector: 'app-branch-compliance',
  templateUrl: './branch-compliance.component.html',
  styleUrls: ['./branch-compliance.component.css']
})

  export class BranchComplianceComponent implements OnInit {
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    displayedColumns: any;
    listing: any;
    dataSource: any;
    constructor(private complianceService: ComplianceService){}
    vst: any;
    ngOnInit() {
      this.vst = JSON.parse(localStorage.getItem("vst"));
      this.displayedColumns = ['fname','refCdDscr','ctgryNm','ctgryCmnt','ctgryScr', 'vstScr', 'countKeys', 'isuNm', 'isuSts', 'isuCmnt'];
      this.complianceService.getBranchVstData(this.vst.adtVstSeq).subscribe(res => {
        this.listing = res;
        this.dataSource = new MatTableDataSource(this.listing);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
    }
  
  }
