import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as S from "./NewsMain.styles";
import {
  TopNewsItem,
  MainNewsItem,
  SideNewsItem,
  ListNewsItem,
  SearchBar,
  removeHtmlTags,
  formatDate,
} from "./NewsItemComponents";

const NewsMain = ({
  backendUrl = window.ENV?.API_URL || `http://localhost:2580`,
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("전기차");
  const [imageResults, setImageResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [topNews, setTopNews] = useState([]);
  const [mainNews, setMainNews] = useState([]);
  const [listNews, setListNews] = useState([]);
  const [keywords, setKeywords] = useState([]);

  const handleSearch = (searchQuery = query) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    const timeoutId = setTimeout(
      () => setError("뉴스 요청 중 오류 발생"),
      10000
    );

    axios
      .get(`${backendUrl}/api/naver-news`, {
        params: { query: searchQuery, display: 20, start: 1 },
      })
      .then((res) => {
        clearTimeout(timeoutId);
        const items = res.data.items || [];
        const unique = Array.from(
          new Map(items.map((i) => [removeHtmlTags(i.title), i])).values()
        );

        setTopNews(unique.slice(0, 3));
        setMainNews(unique.slice(3, 8));
        setListNews(unique.slice(0, 10));
        fetchUpToNImages(unique, 8, () => setLoading(false));
      })
      .catch(() => {
        clearTimeout(timeoutId);
        setError("뉴스 요청 중 오류 발생");
        setLoading(false);
      });
  };

  const fetchUpToNImages = (articles, maxImages, done) => {
    const cache = { ...imageResults };
    let idx = 0,
      loaded = 0;

    const next = () => {
      if (loaded >= maxImages || idx >= articles.length) {
        setImageResults(cache);
        return done && done();
      }
      const art = articles[idx++];
      const key = removeHtmlTags(art.title);
      if (cache[key]) {
        loaded++;
        return setTimeout(next, 100);
      }
      const kws = extractKeywords(key);
      if (!kws) {
        cache[key] = "/images/loading.png";
        loaded++;
        return setTimeout(next, 100);
      }

      Promise.race([
        axios.get(`${backendUrl}/api/naver-image`, { params: { query: kws } }),
        new Promise((_, rej) => setTimeout(() => rej("timeout"), 5000)),
      ])
        .then((res) => {
          const hits = res.data.items || [];
          cache[key] =
            hits[0]?.thumbnail || hits[0]?.link || "/images/loading.png";
          loaded++;
        })
        .catch(() => {
          cache[key] = "/images/loading.png";
          loaded++;
        })
        .finally(() => setTimeout(next, 100));
    };

    next();
  };

  const extractKeywords = (title) => {
    const clean = title
      .replace(/<[^>]+>/g, "")
      .replace(/[^가-힣a-zA-Z0-9 ]/g, "");
    const stop = ["보도", "한다", "이다", "및", "관련", "위해"];
    return clean
      .split(" ")
      .filter((w) => w.length >= 2 && !stop.includes(w))
      .slice(0, 2)
      .join(" ");
  };

  const getImageUrl = (item) => {
    const key = removeHtmlTags(item.title);
    return imageResults[key] || "/images/loading.png";
  };

  const handleChatClick = (item) => {
    const placeholder = "/images/loading.png";
    let imageUrl = getImageUrl(item);
    const key = removeHtmlTags(item.title);

    if (imageUrl === placeholder) {
      const kws = extractKeywords(key);
      axios
        .get(`${backendUrl}/api/naver-image`, { params: { query: kws } })
        .then((res) => {
          const hits = res.data.items || [];
          const fetched = hits[0]?.thumbnail || hits[0]?.link || placeholder;
          setImageResults((prev) => ({ ...prev, [key]: fetched }));
          imageUrl = fetched;

          navigate("/newsDetail", {
            state: {
              title: removeHtmlTags(item.title),
              description: removeHtmlTags(item.description),
              pubDate: formatDate(item.pubDate),
              imageUrl,
              originallink: item.originallink,
              query,
            },
          });
        })
        .catch((e) => {
          console.error("ChatIcon 클릭 시 이미지 재요청 실패:", e);
        });
    } else {
      navigate("/newsDetail", {
        state: {
          title: removeHtmlTags(item.title),
          description: removeHtmlTags(item.description),
          pubDate: formatDate(item.pubDate),
          imageUrl,
          originallink: item.originallink,
          query,
        },
      });
    }
  };

  const handleMore = () => {
    navigate(`/news-list?query=${encodeURIComponent(query)}&sort=sim&page=1`);
  };

  useEffect(() => {
    setLoading(true);
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

    handleSearch();
    window.scrollTo(0, 0);
  }, []);

  return (
    <S.FullWidthContainer>
      <S.Container>
        <S.PageHeader>뉴스 검색</S.PageHeader>
        <SearchBar
          query={query}
          setQuery={setQuery}
          handleSearch={handleSearch}
          keywords={keywords}
        />
        {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
        <>
          <S.SectionHeader>
            <S.SectionIcon>|</S.SectionIcon> 주요 뉴스
          </S.SectionHeader>
          <S.TopNewsContainer>
            {topNews.map((item, i) => (
              <TopNewsItem
                key={i}
                item={item}
                getImageUrl={getImageUrl}
                onChatClick={handleChatClick}
                loading={loading}
              />
            ))}
          </S.TopNewsContainer>

          <S.SectionHeader>
            <S.SectionIcon>|</S.SectionIcon> 오늘의 주요 기사
          </S.SectionHeader>
          <S.MainNewsSection>
            <S.MainNewsContent>
              {mainNews[0] && (
                <MainNewsItem
                  item={mainNews[0]}
                  getImageUrl={getImageUrl}
                  onChatClick={handleChatClick}
                  loading={loading}
                />
              )}
            </S.MainNewsContent>
            <S.SideContent>
              <S.SideGrid>
                {mainNews.slice(1).map((item, i) => (
                  <SideNewsItem
                    key={i}
                    item={item}
                    getImageUrl={getImageUrl}
                    onChatClick={handleChatClick}
                    loading={loading}
                  />
                ))}
              </S.SideGrid>
            </S.SideContent>
          </S.MainNewsSection>

          <S.NewsList>
            <S.NewsHeader>뉴스 리스트</S.NewsHeader>
            <S.NewsItems>
              {listNews.map((item, i) => (
                <ListNewsItem
                  key={i}
                  item={item}
                  onChatClick={handleChatClick}
                  loading={loading}
                />
              ))}
            </S.NewsItems>
            <S.LoadMoreButton onClick={handleMore}>더보기</S.LoadMoreButton>
          </S.NewsList>
        </>
      </S.Container>
    </S.FullWidthContainer>
  );
};

export default NewsMain;
