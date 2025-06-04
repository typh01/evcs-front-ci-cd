import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  removeHtmlTags,
  formatDate,
} from "../../UserInterface/News/NewsMain/NewsItemComponents";
import { Report2, Report3 } from "../Report/AdminReport/AdminReport.styled";
import CommunityNav from "../AdminCommon/AdminNav/AdminComunityNav";
import CategoryManager from "./AdminNewsComponents/CategoryManager";
import NewsFilterBar from "./AdminNewsComponents/NewsFilterBar";
import NewsTable from "./AdminNewsComponents/NewsTable";
import MyNewsPagination from "../../UserInterface/News/MyNews/MyNewsComponents/MyNewsPagination";

const backendUrl = window.ENV?.API_URL || `http://localhost:80`;

const NewsAdminPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // 필터링에 실제 사용
  const [searchField, setSearchField] = useState("title");
  const [sortOption, setSortOption] = useState("latest");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [newCategory, setNewCategory] = useState("");
  const [editingCategoryNo, setEditingCategoryNo] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");

  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const size = 5;

  const token = localStorage.getItem("accessToken");
  const authHeader = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};

  const fetchCategories = () => {
    axios
      .get(`${backendUrl}/admin/news/category/all`, authHeader)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("카테고리 목록 불러오기 실패", err));
  };

  const fetchNews = () => {
    axios
      .get(`${backendUrl}/admin/news/list`, authHeader)
      .then((res) => setNewsList(res.data || []))
      .catch((err) => console.error("뉴스 목록 불러오기 실패", err));
  };

  useEffect(() => {
    fetchCategories();
    fetchNews();
  }, []);

  useEffect(() => {
    const newPage = Number(searchParams.get("page")) || 1;
    setPage(newPage);
  }, [searchParams]);

  useEffect(() => {
    setSearchParams({ page: 1 });
  }, [
    searchTerm,
    sortOption,
    selectedCategory,
    startDate,
    endDate,
    searchField,
  ]);

  const handleRowClick = (item) => {
    navigate("/newsDetail", {
      state: {
        title: removeHtmlTags(item.title),
        description: removeHtmlTags(item.description),
        pubDate: formatDate(item.pubDate),
        imageUrl: item.imageUrl,
        originallink: item.originUrl,
        query: item.query,
      },
    });
  };

  const handleSearchClick = () => {
    setSearchTerm(searchInput);
    setSearchParams({ page: 1 }); // 검색 후 1페이지로 이동
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    axios
      .post(
        `${backendUrl}/admin/news/category`,
        { newsCategory: newCategory },
        authHeader
      )
      .then(() => {
        setNewCategory("");
        fetchCategories();
      })
      .catch((err) => console.error("카테고리 추가 실패", err));
  };

  const handleEditCategory = (newsCategoryNo) => {
    if (!editingCategoryName.trim()) return;
    axios
      .put(
        `${backendUrl}/admin/news/category/${newsCategoryNo}`,
        { newsCategory: editingCategoryName },
        authHeader
      )
      .then(() => {
        setEditingCategoryNo(null);
        setEditingCategoryName("");
        fetchCategories();
      })
      .catch((err) => console.error("카테고리 수정 실패", err));
  };

  const handleDeleteCategory = (newsCategoryNo) => {
    axios
      .delete(`${backendUrl}/admin/news/category/${newsCategoryNo}`, authHeader)
      .then(() => fetchCategories())
      .catch((err) => console.error("카테고리 삭제 실패", err));
  };

  const handlePreset = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    setStartDate(start.toISOString().slice(0, 10));
    setEndDate(end.toISOString().slice(0, 10));
  };

  const toggleStatus = (newsNo, currentStatus) => {
    const newStatus = currentStatus === "Y" ? "N" : "Y";
    axios
      .put(`${backendUrl}/admin/news/status`, null, {
        params: { newsNo, status: newStatus },
        ...authHeader,
      })
      .then(() => fetchNews())
      .catch((err) => console.error("상태 업데이트 실패", err));
  };

  const filteredNews = newsList
    .filter((n) => {
      const pub = new Date(n.pubDate);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      const matchesSearch =
        !searchTerm ||
        (searchField === "title" &&
          removeHtmlTags(n.title || "").includes(searchTerm)) ||
        (searchField === "query" && n.query && n.query.includes(searchTerm));

      return (
        matchesSearch &&
        (!selectedCategory || n.query === selectedCategory) &&
        (!start || pub >= start) &&
        (!end || pub <= end)
      );
    })
    .sort((a, b) => {
      if (sortOption === "latest")
        return new Date(b.pubDate) - new Date(a.pubDate);
      if (sortOption === "views") return b.count - a.count;
      return 0;
    });

  const pagedList = filteredNews.slice((page - 1) * size, page * size);
  const totalPages = Math.ceil(filteredNews.length / size);
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
    <Report2>
      <CommunityNav />
      <Report3>
        <h1 className="text-2xl font-bold mb-4">뉴스 관리</h1>
        <div className="flex gap-8">
          <CategoryManager
            categories={categories}
            newCategory={newCategory}
            setNewCategory={setNewCategory}
            editingCategoryNo={editingCategoryNo}
            editingCategoryName={editingCategoryName}
            setEditingCategoryNo={setEditingCategoryNo}
            setEditingCategoryName={setEditingCategoryName}
            handleAddCategory={handleAddCategory}
            handleEditCategory={handleEditCategory}
            handleDeleteCategory={handleDeleteCategory}
          />
          <div className="w-2/3">
            <NewsFilterBar
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              handleSearchClick={handleSearchClick}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              handlePreset={handlePreset}
              sortOption={sortOption}
              setSortOption={setSortOption}
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
            <NewsTable
              pagedList={pagedList}
              handleRowClick={handleRowClick}
              toggleStatus={toggleStatus}
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
        </div>
      </Report3>
    </Report2>
  );
};

export default NewsAdminPage;
