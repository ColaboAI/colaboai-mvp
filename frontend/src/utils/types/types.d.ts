interface SignUpForm {
  username: string;
  email: string;
  password1: string;
  password2: string;
}
interface SignInForm {
  username: string;
  email: string;
  password: string;
}

interface Combination {
  id: number;
  views: number;
  song: Song;
  covers: Cover[];
  likes: number;
}

interface CombinationForm {
  songId: number;
  covers: number[];
}

interface Cover {
  id: number;
  audio: string;
  title: string;
  category: string;
  description?: string;
  user: UserInfo;
  instrument: Instrument;
  song: Song;
  tags: string[];
  likes: number;
  views: number;
  combination: number | null;
}

interface CoverForm {
  audio: string;
  songId: number;
  title: string;
  category: string;
  description: string;
  tags: string[];
  combinationId: number;
  instrumentId: number;
}

interface CoverFormPut {
  id: number;
  title: string;
  description: string;
  tags: string[];
}

interface LikeForm {
  isLiked: Boolean;
}

interface Instrument {
  id: number;
  name: string;
}

interface Song {
  id: number;
  title: string;
  singer: string;
  category: string;
  reference: string;
  description: string;
}

interface SongForm {
  title: string;
  singer: string;
  category: string;
  reference: string;
  description: string;
}

interface User {
  id: number;
  username: string;
  // email: string;
  description: string;
  photo: string;
  following: number;
  follower: number;
  instruments: Instrument[];
}

interface UserPostForm {
  id: number;
  username: string;
  description?: string;
  photo?: string;
  instruments?: number[];
}

type UserInfo = {
  id: number;
  username: string;
  photo?: string;
  following: number;
  follower: number;
};

type UserLoginResponse = {
  user: UserInfo;
  accessToken: string;
  refreshToken: string;
};

type SongInfo = {
  title: string;
  singer: string;
  category: string;
  reference: string;
  description: string;
};

type TrackInfo = {
  combinationId: number;
  song: SongInfo;
  sources: string[];
  like: boolean;
};

type ResultLine = {
  title: string;
  author: string;
  view: number;
  likes: number;
};

type SegmentDetail = {
  segmentDuration: number;
  startTime: number;
  endTime: number;
  segmentLength: number;
};

type AudioData = {
  channels: Float32Array[];
  sampleRate: number;
  length: number;
};

abstract interface CommentBase {
  id: number;
  content: string;
  user: UserInfo;
  createdAt: string;
  updatedAt: string;
  parentComment: number | null;
}

interface CoverComment extends CommentBase {
  coverId: number;
  reply: CoverComment[];
}

interface SongComment extends CommentBase {
  songId: number;
  reply: SongComment[];
}

interface CommentFormBase {
  id?: number;
  content: string;
  parentComment: number | null;
  userId: number;
}

interface CoverCommentForm extends CommentFormBase {
  coverId: number;
}

interface SongCommentForm extends CommentFormBase {
  songId: number;
}

interface DeleteCommentForm {
  commentId: number;
  parentObjectId: number;
}
