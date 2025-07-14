import { NavDiv, StyledHeaderBtn, NavBoardContentDiv } from "./Nav.styles";
import { useNavigate } from "react-router-dom";

const CommunityNav = () => {
  const navi = useNavigate();
  return (
    <>
      <NavDiv>
        <NavBoardContentDiv>
          <StyledHeaderBtn onClick={() => navi("/admin/adminNews")}>
            뉴스 관리자
          </StyledHeaderBtn>
        </NavBoardContentDiv>
      </NavDiv>
    </>
  );
};

export default CommunityNav;
