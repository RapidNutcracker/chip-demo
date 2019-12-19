import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import {
    MatChipsModule,
    MatIconModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { ChipsComponent } from './components/chips/chips.component';
import { FormsModule } from '@angular/forms';


@NgModule({
    declarations: [
        AppComponent,
        ChipsComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'chips/fruits', pathMatch: 'full' },
            { path: 'chips/:category', component: ChipsComponent }
        ]),
        MatChipsModule,
        MatIconModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
