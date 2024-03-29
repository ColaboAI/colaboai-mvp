import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as urls from 'utils/urls';
import * as apiActions from 'api/actions';
import { useCreateSongSlice } from './slice';
import { selectCreateSong } from './slice/selectors';

export type Props = {};

export default function CreateSongPage(props: Props) {
  useCreateSongSlice();
  const createSongState = useSelector(selectCreateSong);
  const history = useHistory();
  const dispatch = useDispatch();

  const songState = createSongState.songResponse;

  const [Form, setForm] = useState<SongForm>({
    title: '',
    singer: '',
    category: '',
    reference: '',
    description: '',
  });

  const onChangeForm = (
    e: React.FormEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    key: string,
  ) => {
    setForm({ ...Form, [key]: e.currentTarget.value });
  };

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(apiActions.createSong.request(Form));
  };

  useEffect(() => {
    if (!songState.loading) {
      if (songState.data) {
        const newSongId = songState.data.id;
        history.push(urls.Song(newSongId));
      }
    }
  }, [songState, history]);

  const submitDisabled = () => {
    return Form.title === '' || Form.singer === '' || Form.reference === '';
  };

  const styles = {
    label: 'block text-sm font-medium text-gray-700',
    input:
      'mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md',
  };

  return (
    <div data-testid="CreateSongPage" className="flex flex-col items-center">
      <h3 className="text-lg font-medium leading-6 text-gray-900">
        Upload Song
      </h3>
      <p className="mt-1 text-sm text-gray-600">
        Upload a song link to create covers!
      </p>

      <div className="w-full sm:w-3/4 max-w-screen-md m-5">
        <form
          onSubmit={onSubmitForm}
          className="shadow border overflow-hidden sm:rounded-md"
        >
          <div className="px-4 py-5 bg-white sm:p-6">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6">
                <label htmlFor="title" className={styles.label}>
                  노래 제목
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={Form.title}
                  onChange={e => onChangeForm(e, 'title')}
                  className={styles.input}
                />
              </div>

              <div className="col-span-6">
                <label htmlFor="singer" className={styles.label}>
                  아티스트
                </label>
                <input
                  type="text"
                  name="singer"
                  id="singer"
                  value={Form.singer}
                  onChange={e => onChangeForm(e, 'singer')}
                  className={styles.input}
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="category" className={styles.label}>
                  카테고리
                </label>
                <input
                  name="category"
                  id="category"
                  placeholder='ex) "K-POP", "OST", "POP", "R&B"'
                  value={Form.category}
                  onChange={e => onChangeForm(e, 'category')}
                  className={styles.input}
                ></input>
              </div>

              <div className="col-span-6">
                <label htmlFor="reference" className={styles.label}>
                  원곡 링크( Youtube, Soundcloud 등 )
                </label>
                <input
                  type="text"
                  name="reference"
                  id="reference"
                  placeholder="https://www.youtube.com/... or https://soundcloud.com/..."
                  value={Form.reference}
                  onChange={e => onChangeForm(e, 'reference')}
                  className={styles.input}
                />
              </div>

              <div className="col-span-6">
                <label htmlFor="description" className={styles.label}>
                  설명 (선택)
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={5}
                  value={Form.description}
                  onChange={e => onChangeForm(e, 'description')}
                  className={styles.input}
                />
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="submit"
              disabled={submitDisabled()}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
