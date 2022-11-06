import { useState } from 'react';
import CommentInput from './CommentInput';
import ReplyCommentItem from './ReplyCommentItem';
type Props = {
  id: number;
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
  return (
    <div className="container flex-col w-full">
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
            avatarUrl={r.user.photo ?? ''}
            name={r.user.username}
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
