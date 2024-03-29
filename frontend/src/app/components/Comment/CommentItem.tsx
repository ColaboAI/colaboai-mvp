import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import CommentInput from './CommentInput';
import ReplyCommentItem from './ReplyCommentItem';
import * as urls from 'utils/urls';
type Props = {
  id: number;
  userId: number;
  avatarUrl: string;
  name: string;
  timestamp: string;
  commentText: string;
  liked: boolean;
  likeCount: number;
  onCommentSubmit: (
    content: string,
    parentComment: number | null,
    setNewText: (t: string) => void,
  ) => void;
  reply: SongComment[] | CoverComment[];
};

function CommentItem({
  id,
  avatarUrl,
  name,
  userId,
  timestamp,
  commentText,
  liked,
  likeCount,
  onCommentSubmit,
  reply,
}: Props) {
  const [isReply, setIsReply] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const history = useHistory();
  return (
    <div className="container flex-col w-full">
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
          {/* 답글 버튼 누르면 인풋 창 열리기  */}
          <div className="flex ">
            <div
              className="hover:cursor-pointer mr-4 text-sm text-slate-500"
              onClick={() => setIsReply(!isReply)}
            >
              답글 달기
            </div>
            {reply.length > 0 && (
              <div
                className="hover:cursor-pointer text-sm text-slate-500"
                onClick={() => setShowReply(!showReply)}
              >
                {showReply ? '답글 숨기기' : '답글 보기'}
              </div>
            )}
          </div>
        </div>
      </div>

      {!!reply.length &&
        showReply &&
        reply.map((r: SongComment | CoverComment) => (
          <ReplyCommentItem
            commentText={r.content}
            id={r.id}
            key={`${id}_reply_${r.id}`}
            avatarUrl={r.user.photo ?? ''}
            name={r.user.username}
            userId={r.user.id}
            timestamp={r.updatedAt ?? r.createdAt}
            liked={false}
            likeCount={99}
          />
        ))}
      {isReply && (
        <CommentInput
          parentCommentId={id}
          parentCommentAuthorName={name}
          text={replyText}
          setText={setReplyText}
          onCommentSubmit={onCommentSubmit}
        />
      )}
    </div>
  );
}

export default CommentItem;
