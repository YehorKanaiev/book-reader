import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from '@reader/app.component';
import { ReaderModule } from '@reader/reader/reader.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@reader/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { bookReducer } from '@reader/state/book/book.reducer';
import { HomeModule } from '@reader/home/home.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { themeReducer } from '@state/theme/theme.reducer';
import { CoreModule } from '@reader/core/core.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    ReaderModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({ book: bookReducer, theme: themeReducer }, {}),
    HomeModule,
    MatSnackBarModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
