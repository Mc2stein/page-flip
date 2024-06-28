import {
  Component,
  viewChild,
  ElementRef,
  viewChildren,
  inject,
  afterNextRender,
  ViewEncapsulation,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { PageFlip, SizeType } from 'page-flip';

@Component({
  selector: 'app-flip',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `
  <div class="container">
    <div>
        <button type="button" class="btn-prev" (click)="pageFlip.flipPrev()">Previous page</button>
        [<span class="page-current" #current>1</span> of <span class="page-total">{{totalPages}}</span>]
        <button type="button" class="btn-next" (click)="pageFlip.flipNext()">Next page</button>
    </div>

    <div>
        State: <i class="page-state" #state>read</i>, orientation: <i class="page-orientation" #orientation>landscape</i>
    </div>
</div>

<div class="container">
    <div class="flip-book" id="demoBookExample" #flip>
        <div class="page page-cover page-cover-top" data-density="hard" #page>
            <div class="page-content">
                <h2>BOOK TITLE</h2>
            </div>
        </div>
        <div class="page" #page>
            <div class="page-content">
                <h2 class="page-header">Page header 1</h2>
                <div class="page-image" style="background-image: url(https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1025px-Cat03.jpg)"></div>
                <div class="page-text">content</div>
                <div class="page-footer">1</div>
            </div>
        </div>
        <!-- PAGES .... -->
        <div class="page" #page>
            <div class="page-content">
                <h2 class="page-header">Page header 2</h2>
                <div class="page-image" style="background-image: url(https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Sunflower_from_Silesia2.jpg/1200px-Sunflower_from_Silesia2.jpg)"></div>
                <div class="page-text">content</div>
                <div class="page-footer">2</div>
            </div>
        </div>
        <div class="page" #page>
            <div class="page-content">
                <h2 class="page-header">Page header 3</h2>
                <div class="page-image" style="background-image: url(https://png.pngtree.com/thumb_back/fh260/background/20230817/pngtree-lotus-flower-jpg-pink-lotus-flower-image_13023952.jpg)"></div>
                <div class="page-text">content</div>
                <div class="page-footer">3</div>
            </div>
        </div>
        <div class="page page-cover page-cover-bottom" data-density="hard" #page>
            <div class="page-content">
                <h2>THE END</h2>
            </div>
        </div>
    </div>
</div>
  `,
  styleUrl: './app-flip.component.scss',
})
export class AppFlip {
  flip = viewChild.required<ElementRef>('flip');
  pageRefs = viewChildren<ElementRef>('page');
  pages: HTMLElement[] = [];
  pageFlip!: PageFlip;
  size = 'stretch' as SizeType.FIXED;
  document = inject(DOCUMENT);
  state = viewChild.required<ElementRef>('state');
  current = viewChild.required<ElementRef>('current');
  orientation = viewChild.required<ElementRef>('orientation');
  totalPages: number = 0;

  constructor() {
    afterNextRender(() => {
      this.pageFlip = new PageFlip(this.flip().nativeElement, {
        width: 550, // base page width
        height: 733, // base page height

        size: this.size,
        // set threshold values:
        minWidth: 315,
        maxWidth: 550,
        minHeight: 420,
        maxHeight: 733,

        maxShadowOpacity: 0.5, // Half shadow intensity
        showCover: true,
        mobileScrollSupport: false, // disable content scrolling on mobile devices
      });

      this.pageRefs().forEach((ref: ElementRef) => {
        this.pages.push(ref.nativeElement);
      });

      this.totalPages = this.pages.length;

      this.pageFlip.loadFromHTML(this.pages);

      this.pageFlip.on('flip', (e) => {
        this.current().nativeElement.innerText = (e.data as number) + 1;
      });

      // triggered when the state of the book changes
      this.pageFlip.on('changeState', (e) => {
        this.state().nativeElement.innerText = e.data;
      });

      // triggered when page orientation changes
      this.pageFlip.on('changeOrientation', (e) => {
        this.orientation().nativeElement.innerText = e.data;
      });
    });
  }
}
