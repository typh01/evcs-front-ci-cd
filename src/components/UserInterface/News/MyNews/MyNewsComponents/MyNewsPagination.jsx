import * as S from "../../NewsMain/NewsMain.styles";

const MyNewsPagination = ({
  page,
  totalPages,
  startPage,
  endPage,
  visiblePages,
  handlePageChange,
  handleBlockPrev,
  handleBlockNext,
}) => {
  return (
    <S.Pagination>
      {page > 1 && <button onClick={() => handlePageChange(1)}>{"<<"}</button>}
      {startPage > 1 && <button onClick={handleBlockPrev}>{"<"}</button>}

      {visiblePages.map((p) => (
        <button
          key={p}
          onClick={() => handlePageChange(p)}
          disabled={p === page}
        >
          {p}
        </button>
      ))}

      {endPage < totalPages && <button onClick={handleBlockNext}>{">"}</button>}
      {page < totalPages && (
        <button onClick={() => handlePageChange(totalPages)}>{">>"}</button>
      )}
    </S.Pagination>
  );
};

export default MyNewsPagination;
