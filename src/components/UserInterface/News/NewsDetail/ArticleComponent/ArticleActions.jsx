// components/ArticleActions.jsx
import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import * as S from "../NewsDetail.styles";

const ArticleActions = ({
  likeCount,
  hateCount,
  bookmarked,
  hasLiked,
  hasHated,
  auth,
  handleLike,
  handleHate,
  handleBookmark,
  handleBlock,
}) => {
  const navigate = useNavigate();

  return (
    <S.ArticleActions>
      <Button
        onClick={() => navigate(-1)}
        style={{
          backgroundColor: "#03c75a",
          color: "#fff",
          border: "none",
        }}
      >
        뒤로가기
      </Button>
      {auth?.user?.isAuthenticated && (
        <>
          <Button
            size="sm"
            variant={hasLiked ? "primary" : "outline-primary"}
            onClick={handleLike}
          >
            👍 {likeCount}
          </Button>
          <Button
            size="sm"
            variant={hasHated ? "danger" : "outline-danger"}
            onClick={handleHate}
          >
            👎 {hateCount}
          </Button>
          <Button
            size="sm"
            variant={bookmarked ? "success" : "outline-success"}
            onClick={handleBookmark}
          >
            {bookmarked ? "🔖 북마크됨" : "📌 북마크"}
          </Button>
          <Button size="sm" variant="outline-secondary" onClick={handleBlock}>
            ⛔ 게시판 차단
          </Button>
        </>
      )}
    </S.ArticleActions>
  );
};

export default ArticleActions;
