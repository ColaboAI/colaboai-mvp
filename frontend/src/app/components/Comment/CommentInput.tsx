type Props = {
  parentCommentId: number | null;
  parentCommentAuthorName: string | null;
  text: string;
  setText: (text: string) => void;
  onCommentSubmit: (
    content: string,
    parentComment: number | null,
    setNewText: (text: string) => void,
  ) => void;
};

function CommentInput({
  parentCommentId,
  parentCommentAuthorName,
  text,
  setText,
  onCommentSubmit,
}: Props) {
  return (
    <div className="container flex mt-2 w-full">
      <textarea
        className="w-5/6 h-12 rounded-lg border border-gray-300"
        placeholder={
          parentCommentId
            ? `@${parentCommentAuthorName}님에게 답글 남기기`
            : '댓글을 입력하세요'
        }
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        className="w-1/6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 hover:scale-105"
        onClick={e => onCommentSubmit(text, parentCommentId, setText)}
      >
        작성하기
      </button>
    </div>
  );
}

export default CommentInput;
