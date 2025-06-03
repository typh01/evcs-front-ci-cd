import { Button } from "react-bootstrap";

const NewsFilterBar = ({
  searchInput,
  setSearchInput,
  handleSearchClick,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  handlePreset,
  sortOption,
  setSortOption,
  categories,
  selectedCategory,
  setSelectedCategory,
}) => (
  <div className="report-filters mb-4 grid grid-cols-3 gap-2">
    {/* 날짜 필터 */}
    <input
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      className="border p-1"
    />
    <input
      type="date"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      className="border p-1"
    />

    {/* 검색바 */}
    <div className="col-span-2 flex">
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="검색어"
        className="flex-1 border p-1"
      />
      <Button size="sm" onClick={handleSearchClick}>
        검색
      </Button>
    </div>

    {/* 단축 버튼 */}
    <div className="flex gap-1">
      {[7, 30, 180, 365].map((d) => (
        <Button key={d} size="sm" onClick={() => handlePreset(d)}>
          {d === 7 ? "1주" : d === 30 ? "1개월" : d === 180 ? "6개월" : "1년"}
        </Button>
      ))}
      <Button
        size="sm"
        variant="secondary"
        onClick={() => {
          setStartDate("");
          setEndDate("");
        }}
      >
        초기화
      </Button>
    </div>

    {/* 정렬 */}
    <select
      value={sortOption}
      onChange={(e) => setSortOption(e.target.value)}
      className="border p-1"
    >
      <option value="latest">최신순</option>
      <option value="views">조회수순</option>
    </select>

    {/* 카테고리 필터 */}
    <select
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
      className="border p-1"
    >
      <option value="">전체</option>
      {categories.map((cat) => (
        <option key={cat.newsCategoryNo} value={cat.newsCategory}>
          {cat.newsCategory}
        </option>
      ))}
    </select>
  </div>
);

export default NewsFilterBar;
