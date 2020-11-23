import { Component,Inject} from '@angular/core';
import {MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.css']
})
export class ConfirmDeleteComponent  {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string
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
