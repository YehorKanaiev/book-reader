import { Injectable } from '@angular/core';
import { Book, EpubCFI, NavItem } from 'epubjs';
import { DisplayedLocation } from 'epubjs/types/rendition';

@Injectable({
  providedIn: 'root',
})
export class EpubJSHelperService {
  getChapter(book: Book, displayedLocation: DisplayedLocation): NavItem | null {
    const location = displayedLocation as DisplayedLocation & ActualDisplayedLocation;
    const locationHref = location.start.href;

    return this.flatten(book.navigation.toc)
      .filter((chapter: NavItem) => {
        return book.canonical(chapter.href).includes(book.canonical(locationHref));
      }, null)
      .reduce((result: NavItem | null, chapter: NavItem) => {
        const locationAfterChapter = EpubCFI.prototype.compare(location.start.cfi, this.getCfiFromHref(book, chapter.href)) > 0;
        return locationAfterChapter ? chapter : result;
      }, null);
  }

  private flatten(chapters: NavItem[]): NavItem[] {
    const items = [...chapters];
    chapters.forEach(chapter => {
      if (chapter.subitems && chapter.subitems.length) {
        items.push(...this.flatten(chapter.subitems));
      }
    });

    return items;
  }

  private getCfiFromHref(book: Book, href: string): string {
    const id = href.split('#').pop();
    const section = book.spine.get(href);
    const element = (id ? section.document.getElementById(id) : section.document.body) as Element;
    return section.cfiFromElement(element);
  }
}

interface ActualDisplayedLocation {
  start: { href: string; cfi: string };
  end: { href: string; cfi: string };
}
