import * as S from "../NewsDetail.styles";

const CommentInputForm = ({ newComment, setNewComment, onSubmit }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // 줄바꿈 방지
      onSubmit();
    }
  };

  return (
    <S.CommentInputWrapper>
      <S.CommentInput
        placeholder="댓글 작성 공간"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        onKeyDown={handleKeyDown} // 👈 여기 추가
      />
      <S.CommentButton onClick={onSubmit}>작성</S.CommentButton>
    </S.CommentInputWrapper>
  );
};

export default CommentInputForm;
