import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  DetailContainer,
  FieldRow,
  Label,
  Value,
  ButtonGroup,
  ActionButton,
  BackButton,
  FieldRow2,
} from "./ReportDetail.styled";
import axios from "axios";

const ReportDetail = () => {
  const apiUrl = window.ENV?.API_URL || "http://localhost:80";

  const { rpNo } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const id = Number(rpNo);
    const fetchDetail = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/usReports/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReport(data);
      } catch (err) {
        setError("권한이 부족합니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [rpNo]);

  const payload = {
    status: "O",
  };

  const cancellation = async () => {
    if (!window.confirm("신고를 정말 취소 하시겠습니까?")) return;
    try {
      await axios.patch(`${apiUrl}/usReports/${report.rpNo}/o`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      alert("신고가 취소 되었습니다.");
      navigate(0);
    } catch (err) {
      console.error(err);
      alert("신고 취소중 오류가 발생하였습니다.");
    }
  };

  if (loading) return <DetailContainer>불러오는 중...</DetailContainer>;

  if (error) {
    return (
      <DetailContainer style={{ color: "red" }}>
        {error}
        <BackButton onClick={() => navigate(-1)}>뒤로가기</BackButton>
      </DetailContainer>
    );
  }

  return (
    <DetailContainer>
      <h2>게시판 신고 상세보기 (#{report.rpNo})</h2>

      <FieldRow>
        <Label>제목</Label>
        <Value>{report.title}</Value>
      </FieldRow>
      <FieldRow>
        <Label>신고자</Label>
        <Value>{report.memberNo}</Value>
      </FieldRow>
      <FieldRow>
        <Label>피의자</Label>
        <Value>{report.rpMemberNo}</Value>
      </FieldRow>
      <FieldRow>
        <Label>신청일</Label>
        <Value>{report.enrollDate}</Value>
      </FieldRow>
      <FieldRow>
        <Label>진행상황</Label>
        <Value>
          {report.status === "Y"
            ? "처리완료"
            : report.status === "N"
            ? "거부됨"
            : report.status === "P"
            ? "진행중"
            : report.status === "O"
            ? "취소됨"
            : "알 수 없음"}
        </Value>
      </FieldRow>

      {report.content && (
        <FieldRow2>
          <Label>상세 내용</Label>
          <Value style={{ whiteSpace: "pre-wrap" }}>{report.content}</Value>
        </FieldRow2>
      )}

      {report.fileLink && (
        <FieldRow>
          <Label>첨부파일</Label>
          <Value>
            <img
              src={report.fileLink}
              alt="첨부이미지"
              style={{
                width: 500,
                height: 500,
                objectFit: "cover",
                borderRadius: 4,
              }}
            />
          </Value>
        </FieldRow>
      )}

      <ButtonGroup>
        <BackButton onClick={() => navigate(-1)}>뒤로가기</BackButton>
        <div>
          {report.status === "P" && (
            <>
              <ActionButton onClick={cancellation}>신고 취소</ActionButton>
            </>
          )}
        </div>
      </ButtonGroup>
    </DetailContainer>
  );
};

export default ReportDetail;
