import React, { useState } from 'react';
import CommentInput from './CommentInput';
import CommentItem from './CommentItem';
interface Props {
  parentObjectId: number | null;
  parentObjectType: string;
  commentList: SongComment[] | CoverComment[];
  onCommentSubmit: (
    content: string,
    parentComment: number | null,
    setNewText: (t: string) => void,
  ) => void;
}

function Comment({
  commentList,
  parentObjectId,
  parentObjectType,
  onCommentSubmit,
}: Props) {
  const [commentText, setCommentText] = useState('');

  return (
    <div className="mt-8 flex flex-col container">
      <h2 className="pl-4 sm:pl-0 text-left text-sm font-bold text-gray-600 tracking-wider">
        댓글
      </h2>
      <div>
        <div className="flex-col w-full">
          {commentList.map((comment: SongComment | CoverComment) => (
            <CommentItem
              id={comment.id}
              name={comment.user.username ?? '익명'}
              userId={comment.user.id}
              key={comment.id}
              commentText={comment.content}
              timestamp={comment.updatedAt ?? comment.createdAt}
              likeCount={99}
              liked={false}
              avatarUrl={comment.user.photo ?? ''}
              onCommentSubmit={onCommentSubmit}
              reply={comment.reply}
            />
          ))}
        </div>
      </div>
      <CommentInput
        parentCommentId={null}
        parentCommentAuthorName={null}
        text={commentText}
        setText={setCommentText}
        onCommentSubmit={onCommentSubmit}
      />
    </div>
  );
}

export default Comment;
