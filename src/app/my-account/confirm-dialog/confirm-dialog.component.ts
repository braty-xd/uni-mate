import { Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>
    ) { }
  // onNoClick(): void {
  //   this.dialogRef.close();
  // }
  onDismiss() {
    this.dialogRef.close(false)
  }
  
  onConfirm() {
    this.dialogRef.close(true)
  }
}
