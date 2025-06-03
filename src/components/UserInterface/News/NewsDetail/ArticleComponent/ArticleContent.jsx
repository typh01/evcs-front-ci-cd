// components/ArticleContent.jsx
import React from "react";
import * as S from "../NewsDetail.styles";
import * as S1 from "../../NewsMain/NewsMain.styles";

const ArticleContent = ({ article }) => (
  <S.ArticleBox>
    <S.ArticleContent>
      <S.ArticleCategory>{article.query}</S.ArticleCategory>
      <S.ArticleCategory>{article.pubDate}</S.ArticleCategory>
      <S.ArticleText>
        <h2>{article.title}</h2>
        <h5>
          <S1.SectionIcon>|</S1.SectionIcon> 기사의 요약 내용
        </h5>
        <div>{article.description}</div>
        <div>
          <S1.SectionIcon>|</S1.SectionIcon> 기사 이미지
        </div>
        <img
          src={article.imageUrl}
          alt="기사 이미지"
          style={{ width: "100%", maxWidth: "600px", marginTop: 10 }}
        />
        <div>원문 링크</div>
        <a href={article.originUrl} target="_blank" rel="noopener noreferrer">
          {article.originUrl}
        </a>
      </S.ArticleText>
    </S.ArticleContent>
  </S.ArticleBox>
);

export default ArticleContent;
