import { Component, Inject} from "@angular/core"
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog"

export interface DialogData {
    icon: string;
    title: string;
    message: string;
}

@Component({
    styleUrls: ['./dialog.component.css'],
    templateUrl: './dialog.component.html'
})
export class DialogComponent {
    constructor(
        public dialog: MatDialog,
        public dialogReference: MatDialogRef<DialogComponent>,
        @Inject(MAT_DIALOG_DATA) public dialogData: DialogData
    ) {}

    closeDialog(): void {
        this.dialogReference.close();
    }
}