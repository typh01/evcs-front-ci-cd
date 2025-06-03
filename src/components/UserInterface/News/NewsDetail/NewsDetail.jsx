import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext/AuthContext";
import * as S from "./NewsDetail.styles";
import ArticleContent from "./ArticleComponent/ArticleContent";
import ArticleActions from "./ArticleComponent/ArticleActions";
import CommentSection from "./CommentComponent/CommentSection";

const NewsDetail = ({
  backendUrl = window.ENV?.API_URL || `http://localhost:2580`,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();
  const { title, description, pubDate, imageUrl, originallink, query } =
    location.state || {};

  const [article, setArticle] = useState(null);
  const [disabledMsg, setDisabledMsg] = useState("");
  const [likeCount, setLikeCount] = useState(0);
  const [hateCount, setHateCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasHated, setHasHated] = useState(false);

  const token = localStorage.getItem("accessToken");
  const authHeader = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};

  useEffect(() => {
    if (!title || !originallink) return;

    axios
      .post(
        `${backendUrl}/api/news/detail`,
        {
          title,
          originUrl: originallink,
          description,
          imageUrl,
          pubDate,
          query,
        },
        authHeader
      )
      .then((res) => {
        const data = res.data;
        setArticle(data.news);
        setLikeCount(data.likeCount);
        setHateCount(data.hateCount);
        setBookmarked(data.bookmarked);
      })
      .catch((err) => {
        if (err.response?.status === 410) {
          setDisabledMsg(
            err.response?.data?.message || "비활성화된 뉴스입니다."
          );
        } else {
          console.error("뉴스 상세 요청 실패:", err);
        }
      });
  }, [title, originallink]);

  useEffect(() => {
    if (!article || !token) return;

    const p = article.newsNo;
    Promise.all([
      axios.get(`${backendUrl}/api/news/like/status`, {
        params: { newsNo: p },
        ...authHeader,
      }),
      axios.get(`${backendUrl}/api/news/hate/status`, {
        params: { newsNo: p },
        ...authHeader,
      }),
      axios.get(`${backendUrl}/api/news/bookmark/status`, {
        params: { newsNo: p },
        ...authHeader,
      }),
    ])
      .then(([r1, r2, r3]) => {
        setHasLiked(r1.data);
        setHasHated(r2.data);
        setBookmarked(r3.data);
      })
      .catch(() => {});
  }, [article, token]);

  const updateStatus = () => {
    const p = article.newsNo;
    Promise.all([
      axios.get(`${backendUrl}/api/news/like/status`, {
        params: { newsNo: p },
        ...authHeader,
      }),
      axios.get(`${backendUrl}/api/news/hate/status`, {
        params: { newsNo: p },
        ...authHeader,
      }),
      axios.get(`${backendUrl}/api/news/like`, {
        params: { newsNo: p },
        ...authHeader,
      }),
      axios.get(`${backendUrl}/api/news/hate`, {
        params: { newsNo: p },
        ...authHeader,
      }),
    ]).then(([r1, r2, r3, r4]) => {
      setHasLiked(r1.data);
      setHasHated(r2.data);
      setLikeCount(r3.data);
      setHateCount(r4.data);
    });
  };

  const handleLike = () => {
    if (!token) return alert("로그인 후 이용해주세요.");
    axios
      .post(
        `${backendUrl}/api/news/like`,
        { newsNo: article.newsNo },
        authHeader
      )
      .then(updateStatus);
  };

  const handleHate = () => {
    if (!token) return alert("로그인 후 이용해주세요.");
    axios
      .post(
        `${backendUrl}/api/news/hate`,
        { newsNo: article.newsNo },
        authHeader
      )
      .then(updateStatus);
  };

  const handleBookmark = () => {
    if (!token) return alert("로그인 후 이용해주세요.");
    axios
      .post(
        `${backendUrl}/api/news/bookmark`,
        { newsNo: article.newsNo },
        authHeader
      )
      .then(() => {
        return axios.get(`${backendUrl}/api/news/bookmark/status`, {
          params: { newsNo: article.newsNo },
          ...authHeader,
        });
      })
      .then((r) => {
        setBookmarked(r.data);
      });
  };

  const handleBlock = () => {
    if (!auth?.user || !article) return alert("로그인 후 이용 가능합니다.");
    navigate("/reportingPage", {
      state: {
        boardInfo: { boardId: article.newsNo, boardTitle: article.title },
        reporter: { userId: auth.user.memberNo, userName: auth.user.name },
        reported: { userId: article.newsNo, userName: "뉴스 게시판 신고" },
      },
    });
  };
  if (disabledMsg)
    return (
      <S.Container>
        <S.ArticleTitle>⛔ {disabledMsg}</S.ArticleTitle>
        <Button onClick={() => navigate(-1)}>뒤로가기</Button>
      </S.Container>
    );

  if (!article) return <S.Loading>기사를 불러오는 중입니다...</S.Loading>;

  return (
    <S.Container>
      <S.ArticleTitle>
        <strong>뉴스 게시판</strong>
      </S.ArticleTitle>

      <ArticleContent article={article} />
      <ArticleActions
        likeCount={likeCount}
        hateCount={hateCount}
        bookmarked={bookmarked}
        hasLiked={hasLiked}
        hasHated={hasHated}
        auth={auth}
        handleLike={handleLike}
        handleHate={handleHate}
        handleBookmark={handleBookmark}
        handleBlock={handleBlock}
      />
      <CommentSection newsNo={article.newsNo} backendUrl={backendUrl} />
    </S.Container>
  );
};

export default NewsDetail;
