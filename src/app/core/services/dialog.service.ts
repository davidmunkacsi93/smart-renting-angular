import { Injectable }  from "@angular/core";
import { MatDialog } from "@angular/material";
import { DialogComponent } from "src/app/components/dialog/dialog.component";

@Injectable()
export class DialogService {
    constructor(public dialog: MatDialog) {}

    public openDialog(title: string, message: string, icon?: string) {
        this.dialog.open(DialogComponent, {
            width: '500px',
            data: {
                icon: icon,
                message: message,
                title: title
            }
        });
    }
}