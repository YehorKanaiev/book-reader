import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from '@reader/app.component';
import { ReaderModule } from '@reader/reader/reader.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, ReaderModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
