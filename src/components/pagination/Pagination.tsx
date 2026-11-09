import type { SearchType } from "../types/types";

type PaginationProps = {
  type: SearchType;
  currentPage: number;
  pages: number;
  loading: boolean;
  handlePagination: (newPage: number) => void;
}

function Pagination(props: PaginationProps) {
  return (
    props.pages > 1 && (
      <>
        {/* Стрелка для пролистывания пагинации к началу */}
        <button
          className="pagination__button"
          disabled={props.currentPage === 1 || props.loading}
          onClick={() => {
            if (props.currentPage - 1 >= 1) {
              props.handlePagination(props.currentPage - 1);
            }
          }}
        >
          &lt;
        </button>
        {/* Если страница не первая, покажет показвается пагинация на 1ю страницу */}
        {props.currentPage > 1 &&
          props.currentPage - 1 !== 1 &&
          props.currentPage - 2 !== 1 && (
            <>
              {" "}
              <button
                className="pagination__button"
                onClick={() => {
                  props.handlePagination(1);
                }}
                disabled={props.loading}
              >
                1
              </button>
              {/* // Точки при непоказанных страницах пагинации */}
              {props.currentPage - 2 > 2 && <span>...</span>}
            </>
          )}
        {/* Если есть предыдущая страница отобразит и её */}
        {props.currentPage - 2 >= 1 && (
          <button
            className="pagination__button"
            onClick={() => {
             props.handlePagination(props.currentPage - 2);
            }}
            disabled={props.loading}
          >
            {props.currentPage - 2}
          </button>
        )}
        {/* Если есть ещё предыдущая страница отобразит и её */}
        {props.currentPage - 1 >= 1 && (
          <button
            className="pagination__button"
            onClick={() => {
              props.handlePagination(props.currentPage - 1);
            }}
            disabled={props.loading}
          >
            {props.currentPage - 1}
          </button>
        )}
        {/* Если есть персонажи, отображает номер текущей страницы */}
        <button
          className="pagination__button pagination__button--active"
          disabled
        >
          {props.currentPage}
        </button>
        {/* Если есть следующая страница отобразит и её */}
        {props.currentPage + 1 <= props.pages && (
          <button
            className="pagination__button"
            onClick={() => {
              props.handlePagination(props.currentPage + 1);
            }}
            disabled={props.loading}
          >
            {props.currentPage + 1}
          </button>
        )}
        {/* Если есть ещё страница отобразит и её */}
        {props.currentPage + 2 <= props.pages && (
          <>
            <button
              className="pagination__button"
              onClick={() => {
                props.handlePagination(props.currentPage + 2);
              }}
              disabled={props.loading}
            >
              {props.currentPage + 2}
            </button>
            {/* // Точки при непоказанных страницах пагинации */}
            {props.currentPage + 2 < props.pages - 1 && (
              <span>...</span>
            )}
          </>
        )}
        {/* Если страница не последняя,
          покажет показвается пагинация на последнюю страницу */}
        {props.currentPage < props.pages &&
          props.currentPage + 1 !== props.pages &&
          props.currentPage + 2 !== props.pages && (
            <>
              {" "}
              <button
                className="pagination__button"
                onClick={() => {
                  props.handlePagination(props.pages);
                }}
                disabled={props.loading}
              >
                {props.pages}
              </button>
            </>
          )}
        {/* Стрелка для пролистывания пагинации к концу */}
        <button
          className={"pagination__button"}
          disabled={
            props.currentPage === props.pages || props.loading
          }
          onClick={() => {
            if (props.currentPage + 1 <= props.pages) {
              props.handlePagination(props.currentPage + 1);
            }
          }}
        >
          &gt;
        </button>
      </>
    )
  );
}

export default Pagination;
