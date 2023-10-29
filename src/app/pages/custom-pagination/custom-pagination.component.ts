import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-pagination',
  templateUrl: './custom-pagination.component.html',
  styleUrls: ['./custom-pagination.component.scss']
})
export class CustomPaginationComponent implements OnInit {
  @Input() currentPage: number;
  @Input() itemsPerPage: number;
  @Input() totalItems: number;
  @Output() pageChange = new EventEmitter<number>();

  totalPages: number;
  pagesToDisplay: (number | '...')[] = [];

  ngOnInit(): void {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.generatePageNumbers();
  }

  generatePageNumbers() {
    this.pagesToDisplay = [];

    const pagesToShow = 5; // Number of pages to show in the pagination bar

    if (this.totalPages <= pagesToShow) {
      // If there are fewer pages than the pagesToShow limit, display all pages.
      for (let i = 1; i <= this.totalPages; i++) {
        this.pagesToDisplay.push(i);
      }
    } else if (this.currentPage <= Math.floor(pagesToShow / 2) + 1) {
      // If the current page is close to the beginning, display the first pagesToShow pages.
      for (let i = 1; i <= pagesToShow; i++) {
        this.pagesToDisplay.push(i);
      }
      this.pagesToDisplay.push('...');
      this.pagesToDisplay.push(this.totalPages);
    } else if (this.currentPage >= this.totalPages - Math.floor(pagesToShow / 2)) {
      // If the current page is close to the end, display the last pagesToShow pages.
      this.pagesToDisplay.push(1);
      this.pagesToDisplay.push('...');
      for (let i = this.totalPages - pagesToShow + 1; i <= this.totalPages; i++) {
        this.pagesToDisplay.push(i);
      }
    } else {
      // Display pages around the current page.
      this.pagesToDisplay.push(1);
      this.pagesToDisplay.push('...');
      for (let i = this.currentPage - Math.floor(pagesToShow / 2); i <= this.currentPage + Math.floor(pagesToShow / 2); i++) {
        this.pagesToDisplay.push(i);
      }
      this.pagesToDisplay.push('...');
      this.pagesToDisplay.push(this.totalPages);
    }
  }

  changePage(pageNumber: number | '...') {
    if (pageNumber !== this.currentPage && pageNumber !== '...') {
      this.pageChange.emit(pageNumber);
      this.currentPage = pageNumber as number;
      this.generatePageNumbers();
    }
  }
}
