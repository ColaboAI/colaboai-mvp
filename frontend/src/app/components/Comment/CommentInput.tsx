import { useState } from 'react';

type Props = {};

function CommentInput({}: Props) {
  const [text, setText] = useState('');
  return (
    <div className="container mt-2">
      <textarea
        className="w-full"
        placeholder="여기에 입력하세요."
        value={text}
        onChange={e => setText(e.target.value)}
      />
    </div>
  );
}

export default CommentInput;
