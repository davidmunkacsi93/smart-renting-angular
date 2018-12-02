import { NgModule } from "@angular/core";

import { 
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
} from '@angular/material';


@NgModule({
    exports: [
        MatButtonModule,
        MatDialogModule,
        MatProgressSpinnerModule
    ]
})
export class MaterialModule {}