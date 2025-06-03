import { Button } from "react-bootstrap";
import {
  removeHtmlTags,
  formatDate,
} from "../../../UserInterface/News/NewsMain/NewsItemComponents";

const NewsTable = ({ pagedList, handleRowClick, toggleStatus }) => (
  <div className="report-table-container overflow-auto">
    <table className="report-table w-full table-auto border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2 border">제목</th>
          <th className="px-4 py-2 border">카테고리</th>
          <th className="px-4 py-2 border">등록일</th>
          <th className="px-4 py-2 border">조회수</th>
          <th className="px-4 py-2 border">상태</th>
        </tr>
      </thead>
      <tbody>
        {pagedList.map((item) => (
          <tr
            key={item.newsNo}
            className="hover:bg-gray-50 cursor-pointer"
            onClick={() => handleRowClick(item)}
          >
            <td className="px-4 py-2 border">{removeHtmlTags(item.title)}</td>
            <td className="px-4 py-2 border">{item.query}</td>
            <td className="px-4 py-2 border">{formatDate(item.pubDate)}</td>
            <td className="px-4 py-2 border">{item.count}</td>
            <td
              className="px-4 py-2 border"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="mr-2">
                {item.newsStatus === "Y" ? "활성" : "비활성"}
              </span>
              {" | "}
              <Button
                size="sm"
                variant={
                  item.newsStatus === "Y" ? "outline-danger" : "outline-success"
                }
                onClick={() => toggleStatus(item.newsNo, item.newsStatus)}
              >
                {item.newsStatus === "Y" ? "비활성화" : "활성화"}
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default NewsTable;
