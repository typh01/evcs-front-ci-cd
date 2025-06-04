import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { removeHtmlTags, formatDate } from "../NewsMain/NewsItemComponents";
import MyPageNav from "../../Common/Nav/MyPageNav";
import { MyPageDiv } from "../../Member/Mypage/MyPage.styles";
import MyNewsHeader from "./MyNewsComponents/MyNewsHeader";
import MyNewsList from "./MyNewsComponents/MyNewsList";
import MyNewsPagination from "./MyNewsComponents/MyNewsPagination";

const backendUrl = window.ENV?.API_URL || `http://localhost:2580`;

const MyNews = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [fullList, setFullList] = useState([]);
  const [imageResults, setImageResults] = useState({});
  const [activeTab, setActiveTab] = useState("likes");

  const page = parseInt(searchParams.get("page") || "1");
  const size = 3;
  const navigate = useNavigate();

  const token = localStorage.getItem("accessToken");
  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    if (!token) return;

    axios
      .get(`${backendUrl}/news/mypage/${activeTab}`, authHeader)
      .then((res) => {
        setFullList(res.data || []);
        const updatedImages = {};
        (res.data || []).forEach((news) => {
          if (news.imageUrl) updatedImages[news.title] = news.imageUrl;
        });
        setImageResults(updatedImages);
      })
      .catch((err) => {
        console.error("마이뉴스 불러오기 실패", err);
      });

    setSearchParams({ page: 1 });
  }, [activeTab, token]);

  const handleChatClick = (item) => {
    const key = removeHtmlTags(item.title);
    let imageUrl = imageResults[key] || "/images/loading.png";

    if (imageUrl === "/images/loading.png") {
      axios
        .get(`${backendUrl}/naver-image`, { params: { query: key } })
        .then((res) => {
          const hits = res.data.items || [];
          const fetched =
            hits[0]?.thumbnail || hits[0]?.link || "/images/loading.png";
          setImageResults((prev) => ({ ...prev, [key]: fetched }));
          imageUrl = fetched;

          navigate("/newsDetail", {
            state: {
              title: removeHtmlTags(item.title),
              description: removeHtmlTags(item.description),
              pubDate: formatDate(item.pubDate),
              imageUrl,
              originallink: item.originUrl,
              query: item.query,
            },
          });
        })
        .catch((e) => {
          console.error("이미지 재조회 실패", e);
        });
    } else {
      navigate("/newsDetail", {
        state: {
          title: removeHtmlTags(item.title),
          description: removeHtmlTags(item.description),
          pubDate: formatDate(item.pubDate),
          imageUrl,
          originallink: item.originUrl,
          query: item.query,
        },
      });
    }
  };

  const pagedList = fullList.slice((page - 1) * size, page * size);
  const totalPages = Math.ceil(fullList.length / size);
  const currentBlock = Math.floor((page - 1) / 10);
  const startPage = currentBlock * 10 + 1;
  const endPage = Math.min(startPage + 9, totalPages);
  const visiblePages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  const handlePageChange = (targetPage) =>
    setSearchParams({ page: targetPage });
  const handleBlockPrev = () =>
    startPage > 1 && handlePageChange(startPage - 10);
  const handleBlockNext = () =>
    endPage < totalPages && handlePageChange(startPage + 10);

  return (
    <MyPageDiv>
      <MyPageNav />
      <div style={{ flex: 1, padding: "2rem" }}>
        <h2>내 뉴스</h2>
        <MyNewsHeader activeTab={activeTab} setActiveTab={setActiveTab} />
        <MyNewsList
          pagedList={pagedList}
          imageResults={imageResults}
          onClickItem={handleChatClick}
        />
        <MyNewsPagination
          page={page}
          totalPages={totalPages}
          startPage={startPage}
          endPage={endPage}
          visiblePages={visiblePages}
          handlePageChange={handlePageChange}
          handleBlockPrev={handleBlockPrev}
          handleBlockNext={handleBlockNext}
        />
      </div>
    </MyPageDiv>
  );
};

export default MyNews;
