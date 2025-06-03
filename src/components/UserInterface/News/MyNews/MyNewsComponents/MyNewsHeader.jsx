import * as S from "../../NewsMain/NewsMain.styles";

const MyNewsHeader = ({ activeTab, setActiveTab }) => {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <S.KeywordButton
        onClick={() => setActiveTab("likes")}
        active={activeTab === "likes"}
      >
        좋아요한 뉴스
      </S.KeywordButton>
      {" | "}
      <S.KeywordButton
        onClick={() => setActiveTab("bookmarks")}
        active={activeTab === "bookmarks"}
      >
        북마크한 뉴스
      </S.KeywordButton>
    </div>
  );
};

export default MyNewsHeader;
