import React from 'react';
import CommentInput from './CommentInput';
import CommentItem from './CommentItem';
type Props = {};

function Comment({}: Props) {
  return (
    <div className="mt-8 flex flex-col container">
      <h2 className="pl-4 sm:pl-0 text-left text-sm font-bold text-gray-600 tracking-wider">
        댓글
      </h2>
      <div>
        <div className="flex-col w-full">
          <CommentItem
            avatarUrl={'https://avatars.githubusercontent.com/u/69342392?v=4'}
            name="GoGiants1"
            timestamp="어제"
            commentText="안녕하세요"
            liked={true}
            likeCount={99}
          />
          <CommentItem
            avatarUrl={'https://avatars.githubusercontent.com/u/69342392?v=4'}
            name="GoGiants1"
            timestamp="어제"
            commentText="안녕하세요"
            liked={true}
            likeCount={99}
          />
        </div>
      </div>
      <CommentInput />
    </div>
  );
}

export default Comment;
