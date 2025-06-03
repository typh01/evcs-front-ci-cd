import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  ListNewsItem,
  SearchBar,
  removeHtmlTags,
  formatDate,
} from "../NewsMain/NewsItemComponents";
import * as S from "../NewsMain/NewsMain.styles";

const NewsList = ({
  backendUrl = window.ENV?.API_URL || `http://localhost:2580`,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [query, setQuery] = useState(queryParams.get("query") || "전기차");
  const [sort, setSort] = useState(queryParams.get("sort") || "sim");
  const [page, setPage] = useState(Number(queryParams.get("page")) || 1);
  const size = 10;

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState([]);

  const fetchNews = (targetPage, targetQuery = query, targetSort = sort) => {
    setLoading(true);
    axios
      .get(`${backendUrl}/api/naver-news-list`, {
        params: {
          query: targetQuery,
          sort: targetSort,
          page: targetPage,
          size,
        },
      })
      .then((res) => {
        const rawItems = res.data.items || [];
        const uniqueItems = Array.from(
          new Map(rawItems.map((item) => [item.originallink, item])).values()
        );
        setItems(uniqueItems);
        setTotal(res.data.total || 0);
        setPage(targetPage);
      })
      .catch((err) => {
        console.error("뉴스 리스트 요청 실패", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    axios
      .get(`${backendUrl}/api/news/categories`)
      .then((res) => {
        const list = res.data
          .map((item) => item.newsCategory)
          .filter((name) => name && name !== "기타");
        setKeywords(list);
      })
      .catch(() => {
        setKeywords(["전기차"]);
      });
  }, [backendUrl]);

  useEffect(() => {
    fetchNews(1, query, sort);
  }, []);

  const handleSearch = (searchQuery) => {
    const q = (searchQuery ?? query).trim() || "전기차";
    setQuery(q);
    fetchNews(1, q, sort);
  };

  const handleSort = (newSort) => {
    setSort(newSort);
    fetchNews(1, query, newSort);
  };

  const totalPages = Math.ceil(Math.min(total, 1000) / size);
  const currentBlock = Math.floor((page - 1) / 10);
  const startPage = currentBlock * 10 + 1;
  const endPage = Math.min(startPage + 9, totalPages);
  const visiblePages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  const handlePageChange = (targetPage) => {
    fetchNews(targetPage, query, sort);
  };

  const handleBlockPrev = () => {
    const prev = startPage - 10;
    if (prev >= 1) handlePageChange(prev);
  };

  const handleBlockNext = () => {
    const next = startPage + 10;
    if (next <= totalPages) handlePageChange(next);
  };

  const handleChatClick = (item) => {
    navigate("/newsDetail", {
      state: {
        title: removeHtmlTags(item.title),
        description: removeHtmlTags(item.description),
        pubDate: formatDate(item.pubDate),
        imageUrl: item.imageUrl,
        originallink: item.originallink,
        query,
      },
    });
  };

  return (
    <S.FullWidthContainer>
      <S.Container>
        <S.PageHeader>뉴스 전체 보기</S.PageHeader>
        <SearchBar
          query={query}
          setQuery={setQuery}
          handleSearch={handleSearch}
          keywords={keywords}
          loading={loading}
        />
        <S.SortButtons>
          <S.KeywordButton
            onClick={() => handleSort("date")}
            active={sort === "date"}
          >
            최신순
          </S.KeywordButton>
          <S.KeywordButton
            onClick={() => handleSort("sim")}
            active={sort === "sim"}
          >
            유사도순
          </S.KeywordButton>
        </S.SortButtons>
        <S.NewsList>
          <S.NewsItems>
            {items.map((item) => (
              <ListNewsItem
                key={item.originallink}
                item={item}
                onChatClick={handleChatClick}
                loading={loading}
              />
            ))}
          </S.NewsItems>
        </S.NewsList>
        <S.Pagination>
          {page > 1 && (
            <button onClick={() => handlePageChange(1)}>{"<<"}</button>
          )}
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
          {endPage < totalPages && (
            <button onClick={handleBlockNext}>{">"}</button>
          )}
          {page < totalPages && (
            <button onClick={() => handlePageChange(totalPages)}>{">>"}</button>
          )}
        </S.Pagination>
      </S.Container>
    </S.FullWidthContainer>
  );
};

export default NewsList;
