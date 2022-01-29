import { ChangeEvent, FC } from 'react';
import { useGetClientTempPostData } from '../../lib/hooks/useGetClientTempPostData';
import { setPostCategory } from '../../redux-toolkit/slices/post-slice';
import { setTempPostCategory } from '../../redux-toolkit/slices/temp-post-slice';
import { useAppDispatch } from '../../redux-toolkit/store';
import {
  designCollectionRefName,
  devCollectionRefName,
} from '../../service/firebase/firestore';

const SelectCategory: FC = () => {
  const dispatch = useAppDispatch();
  const { tempPost } = useGetClientTempPostData();

  const changeCategory = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    dispatch(setPostCategory(e.target.value));
    dispatch(setTempPostCategory(e.target.value));
  };

  return (
    <>
      <select value={tempPost.category} onChange={changeCategory}>
        <option value={devCollectionRefName}>dev</option>
        <option value={designCollectionRefName}>design</option>
      </select>
    </>
  );
};

export default SelectCategory;