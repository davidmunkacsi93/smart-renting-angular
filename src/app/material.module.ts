import { NgModule } from "@angular/core";

import { 
    MatButtonModule,
    MatDialogModule,
    MatListModule,
    MatMenuModule,
    MatProgressSpinnerModule,
} from '@angular/material';


@NgModule({
    exports: [
        MatButtonModule,
        MatDialogModule,
        MatListModule,
        MatMenuModule,
        MatProgressSpinnerModule
    ]
})
export class MaterialModule {}