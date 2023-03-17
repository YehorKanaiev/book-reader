import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReaderWrapperComponent } from '@reader/reader/features/reader-wrapper.component';
import { Book } from '@reader/reader/services/book';
import { EpubBookService } from '@reader/reader/services/epub-book.service';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'book',
  },
  {
    path: 'book',
    children: [
      {
        path: 'epub',
        component: ReaderWrapperComponent,
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
