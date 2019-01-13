import { NgModule } from "@angular/core";

import { 
    MatButtonModule,
    MatDialogModule,
    MatMenuModule,
    MatProgressSpinnerModule,
} from '@angular/material';


@NgModule({
    exports: [
        MatButtonModule,
        MatDialogModule,
        MatMenuModule,
        MatProgressSpinnerModule
    ]
})
export class MaterialModule {}