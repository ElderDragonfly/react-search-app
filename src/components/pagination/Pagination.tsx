import { Component, type ReactNode } from "react";
import type { SearchType } from "../types/types";

type PaginationProps = {
  type: SearchType;
  currentPage: number;
  pages: number;
  loading: boolean;
  handlePagination: (newPage: number) => void
};

class Pagination extends Component<PaginationProps> {
  render(): ReactNode {
    return (
      this.props.pages > 1 && (
        <>
          {/* Стрелка для пролистывания пагинации к началу */}
          <button
            className="pagination__button"
            disabled={this.props.currentPage === 1 || this.props.loading}
            onClick={() => {
              if (this.props.currentPage - 1 >= 1) {
                this.props.handlePagination(this.props.currentPage - 1);
              }
            }}
          >
            &lt;
          </button>
          {/* Если страница не первая, покажет показвается пагинация на 1ю страницу */}
          {this.props.currentPage > 1 &&
            this.props.currentPage - 1 !== 1 &&
            this.props.currentPage - 2 !== 1 && (
              <>
                {" "}
                <button
                  className="pagination__button"
                  onClick={() => {
                    this.props.handlePagination(1);
                  }}
                  disabled={this.props.loading}
                >
                  1
                </button>
                {/* // Точки при непоказанных страницах пагинации */}
                {this.props.currentPage - 2 > 2 && <span>...</span>}
              </>
            )}
          {/* Если есть предыдущая страница отобразит и её */}
          {this.props.currentPage - 2 >= 1 && (
            <button
              className="pagination__button"
              onClick={() => {
                this.props.handlePagination(this.props.currentPage - 2);
              }}
              disabled={this.props.loading}
            >
              {this.props.currentPage - 2}
            </button>
          )}
          {/* Если есть ещё предыдущая страница отобразит и её */}
          {this.props.currentPage - 1 >= 1 && (
            <button
              className="pagination__button"
              onClick={() => {
                this.props.handlePagination(this.props.currentPage - 1);
              }}
              disabled={this.props.loading}
            >
              {this.props.currentPage - 1}
            </button>
          )}
          {/* Если есть персонажи, отображает номер текущей страницы */}
          <button
            className="pagination__button pagination__button--active"
            disabled
          >
            {this.props.currentPage}
          </button>
          {/* Если есть следующая страница отобразит и её */}
          {this.props.currentPage + 1 <= this.props.pages && (
            <button
              className="pagination__button"
              onClick={() => {
                this.props.handlePagination(this.props.currentPage + 1);
              }}
              disabled={this.props.loading}
            >
              {this.props.currentPage + 1}
            </button>
          )}
          {/* Если есть ещё страница отобразит и её */}
          {this.props.currentPage + 2 <= this.props.pages && (
            <>
              <button
                className="pagination__button"
                onClick={() => {
                  this.props.handlePagination(this.props.currentPage + 2);
                }}
                disabled={this.props.loading}
              >
                {this.props.currentPage + 2}
              </button>
              {/* // Точки при непоказанных страницах пагинации */}
              {this.props.currentPage + 2 < this.props.pages - 1 && <span>...</span>}
            </>
          )}
          {/* Если страница не последняя,
          покажет показвается пагинация на последнюю страницу */}
          {this.props.currentPage < this.props.pages &&
            this.props.currentPage + 1 !== this.props.pages &&
            this.props.currentPage + 2 !== this.props.pages && (
              <>
                {" "}
                <button
                  className="pagination__button"
                  onClick={() => {
                    this.props.handlePagination(this.props.pages);
                  }}
                  disabled={this.props.loading}
                >
                  {this.props.pages}
                </button>
              </>
            )}
          {/* Стрелка для пролистывания пагинации к концу */}
          <button
            className={"pagination__button"}
            disabled={this.props.currentPage === this.props.pages || this.props.loading}
            onClick={() => {
              if (this.props.currentPage + 1 <= this.props.pages) {
                this.props.handlePagination(this.props.currentPage + 1);
              }
            }}
          >
            &gt;
          </button>
        </>
      )
    );
  }
}

export default Pagination;
