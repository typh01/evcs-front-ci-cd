import { Container, Row, Col, Card, Table, Pagination } from "react-bootstrap";

import NoticeNav from "../../Common/Nav/NoticeNav";
import { BoardContainerDiv } from "../Board.styles";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EventBoard = () => {
  const ENV_URL = window.ENV?.API_URL || `http://localhost:2580`;
  const navigate = useNavigate();

  const [events, setEvents] = useState([]); // 기본값을 빈 배열로
  const [page, setPage] = useState(1);
  const [pageInfo, setPageInfo] = useState({
    startPage: 1,
    endPage: 1,
    currentPage: 1,
    maxPage: 1,
    count: 0,
  });

  useEffect(() => {
    axios
      .get(`${ENV_URL}/user-events`, { params: { page } })
      .then((res) => {
        const eventList = res.data?.eventList ?? [];
        const pageInfo = res.data?.pageInfo ?? {
          startPage: 1,
          endPage: 1,
          currentPage: 1,
          maxPage: 1,
          count: 0,
        };
        setEvents(eventList);
        setPageInfo(pageInfo);
      })
      .catch((err) => {
        console.error("이벤트 목록 가져오기 실패:", err);
        setEvents([]);
      });
  }, [page]);

  const renderPagination = () => {
    const items = [];
    const { startPage, endPage, currentPage, maxPage, count } = pageInfo;

    items.push(
      <Pagination.First
        key="first"
        disabled={currentPage === 1}
        onClick={() => setPage(1)}
      >
        맨앞
      </Pagination.First>,
      <Pagination.Prev
        key="prev"
        disabled={currentPage === 1}
        onClick={() => setPage(currentPage - 1)}
      >
        이전
      </Pagination.Prev>
    );

    for (let num = startPage; num <= endPage && num <= maxPage; num++) {
      items.push(
        <Pagination.Item
          key={num}
          active={num === currentPage}
          onClick={() => setPage(num)}
        >
          {num}
        </Pagination.Item>
      );
    }

    items.push(
      <Pagination.Next
        key="next"
        disabled={currentPage === maxPage || count === 0}
        onClick={() => setPage(currentPage + 1)}
      >
        다음
      </Pagination.Next>,
      <Pagination.Last
        key="last"
        disabled={currentPage === maxPage || count === 0}
        onClick={() => setPage(maxPage)}
      >
        마지막
      </Pagination.Last>
    );

    return items;
  };

  return (
    <BoardContainerDiv style={{ height: "900px" }}>
      <NoticeNav />
      <div style={{ width: "100%" }}>
        <div
          className="page-wrapper d-flex flex-column"
          style={{
            paddingBottom: "60px",
            minHeight: "70vh",
          }}
        >
          <Container className="flex-grow-1">
            <Row style={{ marginTop: "20px" }}>
              <Col></Col>
            </Row>
            {/* 테이블 */}
            <Row>
              <Col>
                <Card>
                  <Card.Header className="bg-primary text-white d-flex align-items-center">
                    <span role="img" aria-label="icon">
                      🎉
                    </span>
                    <span className="ms-2">이벤트 게시판</span>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <Table striped bordered hover className="text-center mb-0">
                      <thead>
                        <tr>
                          <th>번호</th>
                          <th>제목</th>
                          <th>작성자</th>
                          <th>작성일자</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(events) && events.length > 0 ? (
                          events.map((event) => (
                            <tr
                              key={event.eventNo}
                              onClick={() =>
                                navigate("/goEventDetailPage", {
                                  state: { event },
                                })
                              }
                            >
                              <td>{event.eventNo}</td>
                              <td>{event.eventName}</td>
                              <td>{event.memberNickname}</td>
                              <td>{event.enrollDate}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4">등록된 이벤트가 없습니다.</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>

          {/* 페이징 */}
          <footer className="footer-pagination">
            <Pagination className="justify-content-center mb-0">
              {renderPagination()}
            </Pagination>
          </footer>
        </div>
      </div>
    </BoardContainerDiv>
  );
};

export default EventBoard;
