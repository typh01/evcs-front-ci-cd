import { Button } from "react-bootstrap";
import * as S from "../NewsDetail.styles";

const CommentItem = ({
  comment,
  depth,
  auth,
  replyTargetId,
  setReplyTargetId,
  replyContent,
  setReplyContent,
  handleAddReply,
  editingCommentId,
  setEditingCommentId,
  editContent,
  setEditContent,
  handleEditComment,
  handleDeleteComment,
  handleReportComment,
  toggleLike,
  toggleHate,
  comments,
  renderComments,
}) => {
  return (
    <div style={{ marginLeft: depth * 20, marginTop: "10px" }}>
      <S.CommentItem>
        <S.CommentHeader>
          <strong>{comment.memberNick || "익명"}</strong>
          <span>{comment.commentDate?.split("T")[0]}</span>
        </S.CommentHeader>
        <S.CommentBody>
          {editingCommentId === comment.id ? (
            <>
              <input
                type="text"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                style={{ width: "80%" }}
              />
              <Button
                size="sm"
                onClick={handleEditComment}
                variant="success"
                style={{ marginLeft: "8px" }}
              >
                저장
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setEditingCommentId(null)}
                style={{ marginLeft: "5px" }}
              >
                취소
              </Button>
            </>
          ) : (
            <>
              <div>{comment.content}</div>
              <S.CommentActions>
                {auth?.user?.isAuthenticated && (
                  <>
                    <Button
                      size="sm"
                      variant={comment.hasLiked ? "primary" : "outline-primary"}
                      onClick={() => toggleLike(comment.id)}
                    >
                      👍 {comment.likes || 0}
                    </Button>
                    <Button
                      size="sm"
                      variant={comment.hasHated ? "danger" : "outline-danger"}
                      onClick={() => toggleHate(comment.id)}
                    >
                      👎 {comment.dislikes || 0}
                    </Button>
                    {depth < 1 && (
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={() => setReplyTargetId(comment.id)}
                      >
                        답글 달기
                      </Button>
                    )}
                    {(comment.mine || auth.user.role === "ADMIN") && (
                      <>
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => {
                            setEditingCommentId(comment.id);
                            setEditContent(comment.content);
                          }}
                        >
                          수정
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          삭제
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="outline-warning"
                      onClick={() => handleReportComment(comment.id)}
                    >
                      🚨 신고
                    </Button>
                  </>
                )}
              </S.CommentActions>

              {auth?.user?.isAuthenticated && replyTargetId === comment.id && (
                <div style={{ marginTop: "10px" }}>
                  <input
                    type="text"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleAddReply(comment.id);
                      }
                    }}
                    placeholder="답글을 입력하세요"
                    style={{ width: "80%", marginRight: "8px" }}
                  />

                  <Button
                    size="sm"
                    onClick={() => handleAddReply(comment.id)}
                    variant="success"
                  >
                    답글 작성
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setReplyTargetId(null)}
                    variant="secondary"
                    style={{ marginLeft: "5px" }}
                  >
                    취소
                  </Button>
                </div>
              )}
            </>
          )}
        </S.CommentBody>
      </S.CommentItem>
      {renderComments(comments, comment.id, depth + 1)}
    </div>
  );
};

export default CommentItem;
