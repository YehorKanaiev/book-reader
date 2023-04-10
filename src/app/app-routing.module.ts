import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReaderComponent } from '@reader/reader/features/reader.component';
import { Book } from '@reader/reader/services/book';
import { EpubBookService } from '@reader/reader/services/epub-book.service';
import { HomeComponent } from '@reader/home/home.component';
import { AppRoutingPaths } from '@reader/app-routing-paths.enum';
import { ReaderRoutingPaths } from '@reader/reader/reader-routing-paths.enum';

const routes: Routes = [
  {
    path: AppRoutingPaths.Home,
    pathMatch: 'full',
    component: HomeComponent,
  },
  {
    path: AppRoutingPaths.Reader,
    children: [
      {
        path: ReaderRoutingPaths.Epub,
        component: ReaderComponent,
        providers: [
          {
            provide: Book,
            useClass: EpubBookService,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
