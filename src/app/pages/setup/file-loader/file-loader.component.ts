import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm  } from '@angular/forms';
import { FileLoaderService } from '../../../shared/services/file-loader.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-file-loader',
  templateUrl: './file-loader.component.html',
  styleUrls: ['./file-loader.component.css']
})
export class FileLoaderComponent implements OnInit {

  public buttonDisabled:boolean;
  public filePath:any;
  public type:String;
  constructor(private fileLoaderService: FileLoaderService,private  toaster: ToastrService) { }

   ngOnInit() {
      this.buttonDisabled = true;
     }

     onChange(deviceValue) {
      console.log(deviceValue);
    }
     onSelectedIndexChanged(selectedValue)
     {
      if(selectedValue=="Recovery")
      {
        this.fileLoaderService.loadFilePath('/recoverydisbursementservice/api/adc-payment-file').subscribe(
          d => {this.filePath=d
          if(this.filePath=="/opt/RecoveryFile/ADC_FILE.csv")
          {
            this.buttonDisabled = false;
            this.type="Recovery";
          }
          else 
          {
            this.filePath="File does not exist !!";
            this.buttonDisabled = true;
          }
          });
      }
      else if(selectedValue=="Budget")
      {
        this.fileLoaderService.loadFilePath('/setupservice/api/load-file-path/Budget').subscribe(
          d => {this.filePath=d
          if(this.filePath=="File does not exist !!")
          {
            this.buttonDisabled = true;
          }
          else 
          {
            this.type="Budget";
            this.buttonDisabled = false;
          }

          });
      }
      else if(selectedValue=="Target")
      {
        this.fileLoaderService.loadFilePath('/setupservice/api/load-file-path/Target').subscribe(
          d => {this.filePath=d
          if(this.filePath=="File does not exist !!")
          {
            this.buttonDisabled = true;
          }
          else 
          {
            this.type="Target";
            this.buttonDisabled = false;
          }
          });
      }
      else if(selectedValue=="Tagging")
      {
        this.fileLoaderService.loadFilePath('/setupservice/api/load-file-path/Tagging').subscribe(
          d => {this.filePath=d
          if(this.filePath=="File does not exist !!")
          {
            this.buttonDisabled = true;
          }
          else 
          {
            this.type="Tagging";
            this.buttonDisabled = false;
          }
          });
      }
      else if(selectedValue=="InsuranceClaim")
      {
        this.fileLoaderService.loadFilePath('/setupservice/api/load-file-path/InsuranceClaim').subscribe(
          d => {this.filePath=d
          if(this.filePath=="File does not exist !!")
          {
            this.buttonDisabled = true;
          }
          else 
          {
            this.type="InsuranceClaim";
            this.buttonDisabled = false;
          }
          });
      }

     }

     uploadFile()
     {
       this.fileLoaderService.uploadFile(this.type).subscribe();
       this.filePath=null;
       this.buttonDisabled = true;
       this.toaster.info("File is being loaded...");     
      }
 }
