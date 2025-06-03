import { Button } from "react-bootstrap";

const CategoryManager = ({
  categories,
  newCategory,
  setNewCategory,
  editingCategoryNo,
  editingCategoryName,
  setEditingCategoryNo,
  setEditingCategoryName,
  handleAddCategory,
  handleEditCategory,
  handleDeleteCategory,
}) => (
  <div className="w-1/3">
    <h2 className="text-xl font-semibold mb-2">카테고리 관리</h2>
    <div className="flex gap-2 mb-2">
      <input
        type="text"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        placeholder="새 카테고리 입력"
        className="border p-1 flex-1"
      />
      <Button onClick={handleAddCategory}>추가</Button>
    </div>
    <table className="w-full table-auto border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2 border">번호</th>
          <th className="px-4 py-2 border">카테고리 이름</th>
          <th className="px-4 py-2 border">관리</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((cat, i) => (
          <tr key={cat.newsCategoryNo} className="text-center border-t">
            <td className="px-4 py-2 border">{i + 1}</td>
            <td className="px-4 py-2 border">
              {editingCategoryNo === cat.newsCategoryNo ? (
                <input
                  className="border p-1 w-full"
                  value={editingCategoryName}
                  onChange={(e) => setEditingCategoryName(e.target.value)}
                />
              ) : (
                cat.newsCategory
              )}
            </td>
            <td className="px-4 py-2 border space-x-2">
              {editingCategoryNo === cat.newsCategoryNo ? (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleEditCategory(cat.newsCategoryNo)}
                  >
                    확인
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setEditingCategoryNo(null)}
                  >
                    취소
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingCategoryNo(cat.newsCategoryNo);
                      setEditingCategoryName(cat.newsCategory);
                    }}
                  >
                    수정
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDeleteCategory(cat.newsCategoryNo)}
                  >
                    삭제
                  </Button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default CategoryManager;
