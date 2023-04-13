import { Injectable, OnDestroy } from '@angular/core';
import { Book } from '@reader/reader/services/book';
import Epub, { Book as ParserBook } from 'epubjs';
import Rendition from 'epubjs/types/rendition';
import { Subject } from 'rxjs';
import { Chapter } from '../interfaces/chapter.interface';
import { EpubJSHelperService } from '@reader/reader/services/epub-jshelper.service';
import { Theme } from '@reader/core/themes.enum';
import { BookConfig } from '@reader/reader/interfaces/book-config.interface';
import { BookMetadata } from '@reader/reader/interfaces/book-metadata.interface';

@Injectable()
export class EpubBookService extends Book implements OnDestroy {
  private book?: ParserBook;
  private rendition?: Rendition;
  private bookPlaceID?: string;
  private theme = Theme.Light;
  private onChaptersInit?: (chapters: Chapter[]) => void;
  private onChapterOpened?: (chapter: Chapter) => void;
  private onMetadataInit?: (metadata: BookMetadata) => void;
  private readonly destroy$ = new Subject<void>();

  constructor(private readonly helper: EpubJSHelperService) {
    super();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  render(config: BookConfig): Promise<void> {
    this.book = Epub(config.sourceURL);
    this.bookPlaceID = config.elementID;
    this.onChaptersInit = config.onChaptersInit;
    this.onChapterOpened = config.onChapterOpened;
    this.onMetadataInit = config.onMetadataInit;
    this.rendition = this.book.renderTo(this.bookPlaceID, { width: `${config.width}px`, height: `${config.height}px` });
    this.initMetadata();
    this.initChapters();
    this.initChapterObserver();
    this.registerThemes();

    return this.rendition.display();
  }

  resize(width: number, height: number): void {
    this.rendition?.resize(width, height);
  }

  next(): Promise<void> {
    return this.rendition?.next() ?? Promise.resolve(undefined);
  }

  previous(): Promise<void> {
    return this.rendition?.prev() ?? Promise.resolve(undefined);
  }

  openChapter(chapter: Chapter): Promise<void> {
    if (!this.rendition) {
      return Promise.resolve();
    }

    return this.rendition?.display(chapter.href);
  }

  setTheme(theme: Theme): void {
    if (!this.rendition) {
      return;
    }

    this.rendition.themes.select(theme);
    this.theme = theme;
    this.rendition.start();
  }

  setFontSize(size: number): void {
    const sizeCss = `${size}px`;
    this.rendition?.themes?.fontSize(sizeCss);
  }

  private registerThemes(): void {
    if (!this.rendition) {
      return;
    }

    this.rendition.themes.register(Theme.Dark, {
      body: { 'background-color': '#303030', color: 'white' },
    });

    this.rendition.themes.register(Theme.Light, {});
  }

  private initChapterObserver(): void {
    if (!this.rendition) {
      return;
    }

    this.rendition.on('rendered', () => {
      if (!this.book || !this.rendition) {
        return;
      }

      const location = this.rendition.currentLocation();
      const chapter = this.helper.getChapter(this.book, location);

      if (this.onChapterOpened) {
        this.onChapterOpened(chapter as Chapter);
      }
    });
  }

  private initMetadata(): void {
    if (!this.book) {
      return;
    }

    this.book.loaded.metadata.then(allMetadata => {
      const metadata = {
        title: allMetadata?.title ?? '',
        author: allMetadata.creator ?? '',
        description: allMetadata.description ?? '',
        language: allMetadata.language ?? '',
      };

      if (this.onMetadataInit) {
        this.onMetadataInit(metadata);
      }
    });
  }

  private initChapters(): void {
    if (!this.book) {
      return;
    }

    this.book.loaded.navigation.then(navigation => {
      const chapters = [...navigation.toc];

      if (this.onChaptersInit) {
        this.onChaptersInit(chapters as Chapter[]);
      }
    });
  }
}
