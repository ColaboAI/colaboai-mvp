import { apiClient } from './client';
import { api } from './index';

const MOCK_GET_DATA = 'MOCK_GET_DATA';
const MOCK_POST_RESPONSE = 'MOCK_POST_RESPONSE';
const MOCK_PUT_RESPONSE = 'MOCK_PUT_RESPONSE';
const MOCK_DELETE_RESPONSE = 'MOCK_DELETE_DATA';

describe('band api', () => {
  beforeEach(() => {
    apiClient.get = jest.fn(() => {
      return new Promise<any>(res =>
        res({
          data: MOCK_GET_DATA,
        }),
      );
    });
    apiClient.post = jest.fn(() => {
      return new Promise<any>(res => res(MOCK_POST_RESPONSE));
    });
    apiClient.put = jest.fn(() => {
      return new Promise<any>(res => res(MOCK_PUT_RESPONSE));
    });
    apiClient.delete = jest.fn(() => {
      return new Promise<any>(res => res(MOCK_DELETE_RESPONSE));
    });
  });

  test('users', async () => {
    const mockSignForm: SignUpForm = {
      username: 'MOCK_USERNAME',
      email: 'MOCK_EMAIL',
      password1: 'MOCK_PASSWORD',
      password2: 'MOCK_PASSWORD',
      tosAgreement: true,
      privacyAgreement: true,
      marketingAgreement: false,
    };
    const mockSigninForm: SignInForm = {
      username: 'MOCK_USERNAME',
      email: 'MOCK_EMAIL',
      password: 'MOCK_PASSWORD',
    };
    const mockId = 323;

    expect(await api.signup(mockSignForm)).toEqual(MOCK_POST_RESPONSE);
    expect(apiClient.post).lastCalledWith(`/api/user/signup/`, mockSignForm);

    expect(await api.signin(mockSigninForm)).toEqual(MOCK_POST_RESPONSE);
    expect(apiClient.post).lastCalledWith(`/api/user/signin/`, mockSignForm);

    expect(await api.signout()).toEqual(MOCK_GET_DATA);
    expect(apiClient.get).lastCalledWith(`/api/user/signout/`);

    expect(await api.getUserInfo(mockId)).toEqual(MOCK_GET_DATA);
    expect(apiClient.get).lastCalledWith(`/api/user/info/${mockId}/`);
  });

  test(`/api/instrument/`, async () => {
    expect(await api.getInstruments()).toEqual(MOCK_GET_DATA);
    expect(apiClient.get).lastCalledWith(`/api/instrument/`);
  });

  test(`/api/cover/<songId: int>/`, async () => {
    const mockCoverForm: CoverForm = {
      audio: 'MOCK_AUDIO',
      songId: 1,
      category: 'MOCK_CATEGORY',
      title: 'MOCK_TITLE',
      description: 'MOCK_DESCRIPTION',
      tags: ['MOCK_TAG1', 'MOCK_TAG2'],
      combinationId: 2,
      instrumentId: 3,
    };
    const mockId = 323;
    (global as any).fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        blob: () => 'DATA',
      }),
    );

    expect(await api.getCoversBySongId(mockId)).toEqual(MOCK_GET_DATA);
    expect(apiClient.get).lastCalledWith(`/api/cover/${mockId}/`);

    expect(await api.postCover(mockCoverForm)).toEqual(MOCK_POST_RESPONSE);
    const calls = (apiClient.post as jest.Mock).mock.calls;
    const lastCall = calls[calls.length - 1];
    expect(lastCall[0]).toEqual(`/api/cover/1/`);

    expect(await api.getCoverBySongAndInstrument(1, 2)).toEqual(MOCK_GET_DATA);
    expect(apiClient.get).lastCalledWith(`/api/cover/${1}/${2}/`);
  });

  test(`/api/cover/info/<coverId: int>/`, async () => {
    const mockId = 323;
    const mockCoverFormPut: CoverFormPut = {
      id: mockId,
      title: 'MOCK_TITLE',
      description: 'MOCK_DESCRIPTION',
      tags: ['MOCK_TAG1', 'MOCK_TAG2'],
    };

    expect(await api.getCoverInfo(mockId)).toEqual(MOCK_GET_DATA);
    expect(apiClient.get).lastCalledWith(`/api/cover/info/${mockId}/`);

    expect(await api.putCoverInfo(mockCoverFormPut)).toEqual(MOCK_PUT_RESPONSE);
    expect(apiClient.put).lastCalledWith(
      `/api/cover/info/${mockCoverFormPut.id}/`,
      mockCoverFormPut,
    );

    expect(await api.deleteCover(mockId)).toEqual(MOCK_DELETE_RESPONSE);
    expect(apiClient.delete).lastCalledWith(`/api/cover/info/${mockId}/`);
  });

  test(`/api/cover/like/<id:int>/`, async () => {
    const mockId = 323;
    const mockForm = { coverId: mockId, isLiked: true };

    expect(await api.getCoverLike(mockId)).toEqual(MOCK_GET_DATA);
    expect(apiClient.get).lastCalledWith(`/api/cover/like/${mockId}/`);

    expect(await api.putCoverLike(mockForm)).toEqual(MOCK_PUT_RESPONSE);
    expect(apiClient.put).lastCalledWith(
      `/api/cover/like/${mockForm.coverId}/`,
      { isLiked: mockForm.isLiked },
    );

    expect(await api.deleteCoverLike(mockId)).toEqual(MOCK_DELETE_RESPONSE);
    expect(apiClient.delete).lastCalledWith(`/api/cover/like/${mockId}/`);
  });

  test(`/api/combination/<songid:int>/`, async () => {
    const mockId = 323;
    const mockForm: CombinationForm = {
      songId: mockId,
      covers: [1, 2, 3],
    };

    expect(await api.getCombinationsBySong(mockId)).toEqual(MOCK_GET_DATA);
    expect(apiClient.get).lastCalledWith(`/api/combination/${mockId}/`);

    expect(await api.postCombination(mockForm)).toEqual(MOCK_POST_RESPONSE);
    expect(apiClient.post).lastCalledWith(
      `/api/combination/${mockForm.songId}/`,
      mockForm,
    );
  });

  test(`/api/combination/main/`, async () => {
    expect(await api.getCombinationsMain()).toEqual(MOCK_GET_DATA);
    expect(apiClient.get).lastCalledWith(`/api/combination/main/`);
  });

  test(`/api/song/`, async () => {
    const mockForm: SongForm = {} as any;

    expect(await api.getSongList()).toEqual(MOCK_GET_DATA);
    expect(apiClient.get).lastCalledWith(`/api/song/`);

    expect(await api.postSong(mockForm)).toEqual(MOCK_POST_RESPONSE);
    expect(apiClient.post).lastCalledWith(`/api/song/`, mockForm);
  });

  test(`/api/song/search/?search=key:str/`, async () => {
    const mockKey = 'MOCK_KEY';

    expect(await api.getSongBySearch(mockKey)).toEqual(MOCK_GET_DATA);
    expect(apiClient.get).lastCalledWith(`/api/song/search/`, {
      params: { search: mockKey },
    });
  });

  test(`/api/song/info/<id: int>`, async () => {
    const mockId = 323;

    expect(await api.getSongInfo(mockId)).toEqual(MOCK_GET_DATA);
    expect(apiClient.get).lastCalledWith(`/api/song/info/${mockId}/`);
  });

  test(`/api/log/`, async () => {
    const mockId = 323;

    expect(await api.logCombination(mockId)).toEqual(MOCK_POST_RESPONSE);
    expect(apiClient.post).lastCalledWith(`/api/log/combination/`, {
      combination_id: mockId,
    });

    expect(await api.logCover(mockId)).toEqual(MOCK_POST_RESPONSE);
    expect(apiClient.post).lastCalledWith(`/api/log/cover/`, {
      cover_id: mockId,
    });
  });

  test(`/api/user/info/<id:int>/`, async () => {
    const mockForm: UserPostForm = {
      id: 22,
      username: 'MOCK_USERNAME',
    };
    const mockFull: UserPostForm = {
      id: 22,
      username: 'USERNAME',
      description: 'DESCRIPTION',
      instruments: [1, 2, 3, 4],
    };

    expect(await api.postUserInfo(mockForm)).toEqual(MOCK_POST_RESPONSE);

    expect(await api.postUserInfo(mockFull)).toEqual(MOCK_POST_RESPONSE);
    let calls = (apiClient.post as jest.Mock).mock.calls;
    expect(calls[0][0]).toEqual('/api/user/info/22/');
    expect(calls[1][0]).toEqual('/api/user/info/22/');

    expect(calls[1][1].get('username')).toEqual('USERNAME');
    expect(calls[1][1].get('description')).toEqual('DESCRIPTION');
  });

  test(`/api/combination/like/<pk:int>/`, async () => {
    const mockId = 323;
    const mockForm = { combinationId: mockId, isLiked: true };

    expect(await api.getCombinationLike(mockId)).toEqual(MOCK_GET_DATA);
    expect(apiClient.get).lastCalledWith(`/api/combination/like/${mockId}/`);

    expect(await api.putCombinationLike(mockForm)).toEqual(MOCK_PUT_RESPONSE);
    expect(apiClient.put).lastCalledWith(
      `/api/combination/like/${mockForm.combinationId}/`,
      { isLiked: mockForm.isLiked },
    );
  });

  // Basic testing
  //   test(`urlll/<id:int>/`, async () => {
  //     const mockId = 323;
  //     const mockForm = { coverId: mockId, isLiked: true };

  //     expect(await api.getCoverLike(mockId)).toEqual(MOCK_GET_DATA);
  //     expect(apiClient.get).lastCalledWith(`urlll/${mockId}/`);

  //     expect(await api.putCoverLike(mockForm)).toEqual(MOCK_POST_RESPONSE);
  //     expect(apiClient.post).lastCalledWith(
  //       `urlll/${mockForm.coverId}/`,
  //       mockForm,
  //     );

  //     expect(await api.putCoverLike(mockForm)).toEqual(MOCK_PUT_RESPONSE);
  //     expect(apiClient.put).lastCalledWith(
  //       `urlll/${mockForm.coverId}/`,
  //       mockForm,
  //     );

  //     expect(await api.deleteCoverLike(mockId)).toEqual(MOCK_DELETE_RESPONSE);
  //     expect(apiClient.delete).lastCalledWith(`urlll/${mockId}/`);
  //   });
});
