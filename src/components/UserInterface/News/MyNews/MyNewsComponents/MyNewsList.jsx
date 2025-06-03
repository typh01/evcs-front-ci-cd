import { removeHtmlTags } from "../../NewsMain/NewsItemComponents";

const MyNewsList = ({ pagedList, imageResults, onClickItem }) => {
  return (
    <ul>
      {pagedList.map((item) => (
        <li key={item.newsNo} style={{ marginBottom: "1rem" }}>
          <strong
            onClick={() => onClickItem(item)}
            style={{
              cursor: "pointer",
              color: "#0366d6",
              textDecoration: "underline",
            }}
          >
            {removeHtmlTags(item.title)}
          </strong>
          <p>{removeHtmlTags(item.description)}</p>
          {imageResults[item.title] && (
            <img src={imageResults[item.title]} alt="" width={100} />
          )}
        </li>
      ))}
    </ul>
  );
};

export default MyNewsList;
