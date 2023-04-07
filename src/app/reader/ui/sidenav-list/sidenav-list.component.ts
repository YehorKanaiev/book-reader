import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { Chapter } from '@reader/reader/interfaces/chapter.interface';

@Component({
  selector: 'rd-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavListComponent {
  @Input()
  items: Chapter[] = [];

  @Input()
  itemTemplate?: TemplateRef<Chapter>;

  @Input()
  marked?: Chapter | null;

  @Output()
  itemClicked = new EventEmitter<Chapter>();

  onItemClick(item: Chapter, e?: MouseEvent): void {
    e?.stopPropagation();
    this.itemClicked.emit(item);
  }

  isMarked(item: Chapter): boolean {
    return !!this.marked && this.marked.id === item.id;
  }

  identifyItem(index: number, item: Chapter): string {
    return item.id;
  }

  hasSubItems(item: Chapter): boolean {
    return item.subitems && !!item.subitems.length;
  }

  isExpanded(item: Chapter): boolean {
    return this.isMarked(item) || (this.hasSubItems(item) && !!item.subitems.find(sub => this.isMarked(sub)));
  }
}
