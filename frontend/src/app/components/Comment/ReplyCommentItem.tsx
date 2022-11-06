import React from 'react';

type Props = {
  id: number;
  avatarUrl: string;
  name: string;
  timestamp: string;
  commentText: string;
  liked: boolean;
  likeCount: number;
};

function ReplyCommentItem({
  id,
  avatarUrl,
  name,
  timestamp,
  commentText,
  liked,
  likeCount,
}: Props) {
  return (
    <div className="ml-4 container flex-col w-full">
      <div className="container flex mt-2 hover:bg-blue-50">
        <img
          className="mx-2 self-center inline-block h-12 w-12 rounded-full ring-2 ring-white"
          src={avatarUrl}
          alt="avatar"
        />
        <div className="space-y-1">
          <div className="flex space-x-2 text-center items-center">
            <h3 className="text-left text-sm font-bold text-gray-700">
              {name}
            </h3>
            <p className="text-left text-xs font-light text-gray-400 overflow-hidden">
              {timestamp}
            </p>
          </div>
          <div>{commentText}</div>
        </div>
      </div>
    </div>
  );
}

export default ReplyCommentItem;
