import React from 'react';
import { useHistory } from 'react-router-dom';
import * as urls from 'utils/urls';
type Props = {
  id: number;
  avatarUrl: string;
  name: string;
  userId: number;
  timestamp: string;
  commentText: string;
  liked: boolean;
  likeCount: number;
};

function ReplyCommentItem({
  id,
  avatarUrl,
  name,
  userId,
  timestamp,
  commentText,
  liked,
  likeCount,
}: Props) {
  const history = useHistory();
  return (
    <div className="ml-4 container flex-col w-full">
      <div className="container flex mt-2 hover:bg-blue-50">
        <img
          className="hover:cursor-pointer mx-2 self-center inline-block h-12 w-12 rounded-full ring-2 ring-white"
          src={avatarUrl}
          alt="avatar"
          onClick={() => history.push(urls.Profile(userId))}
        />
        <div className="space-y-1">
          <div className="flex space-x-2 text-center items-center">
            <h3
              className="hover:cursor-pointer text-left text-sm font-bold text-gray-700"
              onClick={() => history.push(urls.Profile(userId))}
            >
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
