import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../Context/AuthContext/AuthContext";
import CommentItem from "./CommentItem";
import CommentInputForm from "./CommentInputForm";
import * as S from "../NewsDetail.styles";

const CommentSection = ({ newsNo, backendUrl }) => {
  const { auth } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyTargetId, setReplyTargetId] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const token = localStorage.getItem("accessToken");
  const authHeader = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};

  useEffect(() => {
    fetchComments();
  }, [newsNo]);

  const fetchComments = () => {
    axios
      .get(`${backendUrl}/news/comment/list`, {
        params: { newsNo },
        ...authHeader,
      })
      .then((res) => setComments(res.data))
      .catch((error) => console.error("댓글 불러오기 실패", error));
  };

  const handleAddComment = () => {
    if (!token) return alert("로그인 후 이용해주세요.");
    if (!newComment.trim()) return;
    axios
      .post(
        `${backendUrl}/news/comment`,
        { newsNo, content: newComment },
        authHeader
      )
      .then(() => {
        setNewComment("");
        fetchComments();
      })
      .catch((error) => console.error("댓글 작성 실패", error));
  };

  const handleAddReply = (parentId) => {
    if (!token) return alert("로그인 후 이용해주세요.");
    if (!replyContent.trim()) return;
    axios
      .post(
        `${backendUrl}/news/comment`,
        { newsNo, content: replyContent, parentId },
        authHeader
      )
      .then(() => {
        setReplyContent("");
        setReplyTargetId(null);
        fetchComments();
      })
      .catch((error) => console.error("답글 작성 실패", error));
  };

  const toggleLike = (commentId) => {
    if (!token) return alert("로그인 후 이용해주세요.");
    const current = comments.find((c) => c.id === commentId);
    if (!current) return;

    const deleteHateIfExist = current.hasHated
      ? axios.delete(`${backendUrl}/news/comment/hate`, {
          params: { newsCmtId: commentId },
          ...authHeader,
        })
      : Promise.resolve();

    const likeAction = current.hasLiked
      ? axios.delete(`${backendUrl}/news/comment/like`, {
          params: { newsCmtId: commentId },
          ...authHeader,
        })
      : axios.post(`${backendUrl}/news/comment/like`, null, {
          params: { newsCmtId: commentId },
          ...authHeader,
        });

    deleteHateIfExist
      .then(() => likeAction)
      .then(() => fetchComments())
      .catch((error) => console.error("좋아요 토글 실패", error));
  };

  const toggleHate = (commentId) => {
    if (!token) return alert("로그인 후 이용해주세요.");
    const current = comments.find((c) => c.id === commentId);
    if (!current) return;

    const deleteLikeIfExist = current.hasLiked
      ? axios.delete(`${backendUrl}/news/comment/like`, {
          params: { newsCmtId: commentId },
          ...authHeader,
        })
      : Promise.resolve();

    const hateAction = current.hasHated
      ? axios.delete(`${backendUrl}/news/comment/hate`, {
          params: { newsCmtId: commentId },
          ...authHeader,
        })
      : axios.post(`${backendUrl}/news/comment/hate`, null, {
          params: { newsCmtId: commentId },
          ...authHeader,
        });

    deleteLikeIfExist
      .then(() => hateAction)
      .then(() => fetchComments())
      .catch((error) => console.error("싫어요 토글 실패", error));
  };

  const handleEditComment = () => {
    if (!token) return alert("로그인 후 이용해주세요.");
    if (!editContent.trim()) return;
    axios
      .put(
        `${backendUrl}/news/comment`,
        { commentId: editingCommentId, content: editContent },
        authHeader
      )
      .then(() => {
        setEditingCommentId(null);
        setEditContent("");
        fetchComments();
      })
      .catch((error) => console.error("댓글 수정 실패", error));
  };

  const handleDeleteComment = (commentId) => {
    if (!token) return alert("로그인 후 이용해주세요.");
    if (!window.confirm("댓글을 삭제할까요?")) return;
    axios
      .delete(`${backendUrl}/news/comment/${commentId}`, authHeader)
      .then(fetchComments)
      .catch((error) => console.error("댓글 삭제 실패", error));
  };

  const handleReportComment = (commentId) => {
    if (!token) return alert("로그인 후 이용해주세요.");
    if (!window.confirm("해당 댓글을 신고하시겠습니까?")) return;
    axios
      .post(
        `${backendUrl}/report/comment`,
        { newsCmtId: commentId, reportReason: "부적절한 내용" },
        authHeader
      )
      .then(() => alert("신고가 접수되었습니다."))
      .catch((error) => {
        console.error("댓글 신고 실패", error);
        alert("신고 처리 중 오류 발생");
      });
  };

  const renderComments = (comments, parentId = null, depth = 0) =>
    comments
      .filter((c) => c.parentId === parentId)
      .map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          depth={depth}
          auth={auth}
          replyTargetId={replyTargetId}
          setReplyTargetId={setReplyTargetId}
          replyContent={replyContent}
          setReplyContent={setReplyContent}
          handleAddReply={handleAddReply}
          editingCommentId={editingCommentId}
          setEditingCommentId={setEditingCommentId}
          editContent={editContent}
          setEditContent={setEditContent}
          handleEditComment={handleEditComment}
          handleDeleteComment={handleDeleteComment}
          handleReportComment={handleReportComment}
          toggleLike={toggleLike}
          toggleHate={toggleHate}
          comments={comments}
          renderComments={renderComments}
        />
      ));

  return (
    <S.CommentSectionContainer>
      {auth?.user?.isAuthenticated && (
        <CommentInputForm
          newComment={newComment}
          setNewComment={setNewComment}
          onSubmit={handleAddComment}
        />
      )}
      <S.CommentList>{renderComments(comments)}</S.CommentList>
    </S.CommentSectionContainer>
  );
};

export default CommentSection;
