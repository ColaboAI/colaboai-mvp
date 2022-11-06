import { apiClient } from './client';
export const api = {
  // users
  signup: async (form: SignUpForm) => {
    return await apiClient.post<null>(`/api/user/signup/`, form);
  },
  signin: async (form: SignInForm) => {
    return await apiClient.post<UserInfo>(`/api/user/signin/`, form);
  },
  signout: async () => {
    const response = await apiClient.get<null>(`/api/user/signout/`);
    return response.data;
  },
  getUserInfo: async (userId: number) => {
    const response = await apiClient.get<User>(`/api/user/info/${userId}/`);
    return response.data;
  },

  postUserInfo: async (userPostForm: UserPostForm) => {
    const userFormData = new FormData();
    if (userPostForm.photo) {
      const blob = await fetch(userPostForm.photo).then(r => r.blob());
      const photoFile = new File([blob], 'image.png', {
        type: 'image/png',
      });
      userFormData.append('photo', photoFile);
    }

    if (userPostForm.username) {
      userFormData.append('username', userPostForm.username);
    }
    if (userPostForm.description) {
      userFormData.append('description', userPostForm.description);
    }
    if (userPostForm.instruments) {
      userFormData.append(
        'instruments',
        JSON.stringify(userPostForm.instruments),
      );
    }

    return await apiClient.post<User>(
      `/api/user/info/${userPostForm.id}/`,
      userFormData,
    );
  },

  // `/api/instrument/`
  getInstruments: async () => {
    const response = await apiClient.get<Instrument[]>(`/api/instrument/`);
    return response.data;
  },

  // `/api/cover/<songId: int>/`
  getCoversBySongId: async (songId: number) => {
    const response = await apiClient.get<Cover[]>(`/api/cover/${songId}/`);
    return response.data;
  },
  postCover: async (coverForm: CoverForm) => {
    const audioBlob = await fetch(coverForm.audio).then(r => r.blob());
    const audiofile = new File([audioBlob], 'audiofile.mp3', {
      type: 'audio/mpeg',
    });
    const coverFormData = new FormData();
    coverFormData.append('audio', audiofile);
    coverFormData.append('title', coverForm.title);
    coverFormData.append('category', coverForm.category);
    coverFormData.append('description', coverForm.description);
    coverFormData.append('tags', JSON.stringify(coverForm.tags));
    // coverFormData.append('combination', String(coverForm.combinationId));
    coverFormData.append('instrument', String(coverForm.instrumentId));

    return await apiClient.post<Cover>(
      `/api/cover/${coverForm.songId}/`,
      coverFormData,
      // { headers: { 'Content-Type': 'multipart/form-data' } },
    );
  },
  getCoverBySongAndInstrument: async (songId: number, instrumentId: number) => {
    const response = await apiClient.get<Cover>(
      `/api/cover/${songId}/${instrumentId}/`,
    );
    return response.data;
  },

  // `/api/cover/info/<pk:int>/`
  getCoverInfo: async (coverId: number) => {
    const response = await apiClient.get<Cover>(`/api/cover/info/${coverId}/`);
    return response.data;
  },

  putCoverInfo: async (coverForm: CoverFormPut) => {
    return await apiClient.put<Cover>(
      `/api/cover/info/${coverForm.id}/`,
      coverForm,
    );
  },
  deleteCover: async (coverId: number) => {
    return await apiClient.delete<null>(`/api/cover/info/${coverId}/`);
  },

  // `/api/cover/like/<pk:int>/`
  getCoverLike: async (coverId: number) => {
    const response = await apiClient.get<{ isLiked: Boolean }>(
      `/api/cover/like/${coverId}/`,
    );
    return response.data;
  },
  putCoverLike: async (form: { coverId: number; isLiked: Boolean }) => {
    return await apiClient.put<{ isLiked: Boolean }>(
      `/api/cover/like/${form.coverId}/`,
      { isLiked: form.isLiked },
    );
  },
  deleteCoverLike: async (coverId: number) => {
    return await apiClient.delete<null>(`/api/cover/like/${coverId}/`);
  },

  // `/api/combination/<songid:int>/`
  getCombinationsBySong: async (songId: number) => {
    const response = await apiClient.get<Combination[]>(
      `/api/combination/${songId}/`,
    );
    return response.data;
  },
  postCombination: async (form: CombinationForm) => {
    return await apiClient.post<Combination[]>(
      `/api/combination/${form.songId}/`,
      form,
    );
  },

  // `/api/combination/main/`
  getCombinationsMain: async () => {
    const response = await apiClient.get<Combination[]>(
      `/api/combination/main/`,
    );
    return response.data;
  },

  // `/api/combination/like/<pk:int>/`
  getCombinationLike: async (combinationId: number) => {
    const response = await apiClient.get<{ isLiked: Boolean }>(
      `/api/combination/like/${combinationId}/`,
    );
    return response.data;
  },

  putCombinationLike: async (form: {
    combinationId: number;
    isLiked: Boolean;
  }) => {
    return await apiClient.put<{ isLiked: Boolean }>(
      `/api/combination/like/${form.combinationId}/`,
      { isLiked: form.isLiked },
    );
  },

  // `/api/song/`
  getSongList: async () => {
    const response = await apiClient.get<Song[]>(`/api/song/`);
    return response.data;
  },
  postSong: async (songForm: SongForm) => {
    return await apiClient.post<Song>(`/api/song/`, songForm);
  },

  // `/api/song/search/?search=key:str/`
  getSongBySearch: async (key: string) => {
    const response = await apiClient.get<Song[]>(`/api/song/search/`, {
      params: { search: key },
    });
    return response.data;
  },

  // `/api/song/info/<id: int>`
  getSongInfo: async (songId: number) => {
    const response = await apiClient.get<Song>(`/api/song/info/${songId}/`);
    return response.data;
  },

  // `/api/log/cover/`
  logCover: async (coverId: number) => {
    const response = await apiClient.post(`/api/log/cover/`, {
      cover_id: coverId,
    });
    return response;
  },

  // `/api/log/combination/`
  logCombination: async (combinationId: number) => {
    const response = await apiClient.post(`/api/log/combination/`, {
      combination_id: combinationId,
    });
    return response;
  },

  // `/api/song/<id:int>/comment`
  getSongComments: async (id: number) => {
    const response = await apiClient.get<SongComment[]>(
      `/api/song/${id}/comment/`,
    );
    return response.data;
  },

  postSongComment: async (form: SongCommentForm) => {
    const res = await apiClient.post<SongComment>(
      `/api/song/${form.songId}/comment/`,
      form,
    );
    return res.data;
  },

  // `/api/song/<song_id:int>/comment/<comment_id:int>``
  deleteSongComment: async (form: DeleteCommentForm) => {
    await apiClient.delete<null>(
      `/api/song/${form.parentObjectId}/comment/${form.commentId}/`,
    );
    return form.commentId;
  },
  editSongComment: async (form: SongCommentForm) => {
    const res = await apiClient.put<SongComment>(
      `/api/song/comment/${form.id}/`,
      form,
    );
    return res.data;
  },

  // `/api/cover/<id:int>/comment`
  getCoverComments: async (id: number) => {
    const response = await apiClient.get<CoverComment[]>(
      `/api/cover/${id}/comment/`,
    );
    return response.data;
  },

  postCoverComment: async (form: CoverCommentForm) => {
    const res = await apiClient.post<CoverComment>(
      `/api/cover/${form.coverId}/comment/`,

      form,
    );
    return res.data;
  },

  // `/api/cover/<cover_id:int>/comment/<comment_id:int>``
  deleteCoverComment: async (form: DeleteCommentForm) => {
    await apiClient.delete<null>(
      `/api/cover/${form.parentObjectId}/comment/${form.commentId}/`,
    );
    return form.commentId;
  },

  editCoverComment: async (form: CoverCommentForm) => {
    const res = await apiClient.put<CoverComment>(
      `/api/cover/${form.coverId}/comment/${form.id}/`,
      form,
    );
    return res.data;
  },
};
