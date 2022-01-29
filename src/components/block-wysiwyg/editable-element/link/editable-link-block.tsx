import { ChangeEvent, FC, useState } from 'react';
import { onInputChange } from '../../../../lib/utils/content-editable-utils';
import { IRefData } from '../../../../redux-toolkit/model/ref-data-model';
import { setLinkTitleData } from '../../../../redux-toolkit/slices/post-slice';
import { setTempLinkTitleData } from '../../../../redux-toolkit/slices/temp-post-slice';
import { useAppDispatch } from '../../../../redux-toolkit/store';
import EditableElementSwitch from '../../editable-element-switch';
import styles from './editable-link-block.module.scss';
import UrlInput from './url-input';

type Props = {
  contentEditable: boolean;
  datas: IRefData[];
  data: IRefData;
  idx: number;
};

const EditableLinkBlock: FC<Props> = ({
  contentEditable,
  datas,
  data,
  idx,
}) => {
  const currentIndex = idx;
  const dispatch = useAppDispatch();
  const [text, setText] = useState<string>('');

  const onInput = (e: ChangeEvent<HTMLParagraphElement>) => {
    onInputChange(
      e,
      setTempEditableLinkBlockData,
      updateEditableLinkBlockInlineData
    );
  };

  const setTempEditableLinkBlockData = (inputPureHtml: string) => {
    dispatch(setTempLinkTitleData({ inputPureHtml, currentIndex }));
    setText(inputPureHtml); // onKeyDown의 removeBlock() 조건 + 렌더링 성능 위해
  };

  const updateEditableLinkBlockInlineData = (inputPureHtml: string) => {
    dispatch(
      setLinkTitleData({
        inputPureHtml,
        currentIndex,
      })
    );
    setTempEditableLinkBlockData(inputPureHtml);
  };

  return (
    <li className={styles.editable__link__li}>
      {contentEditable ? (
        <>
          <EditableElementSwitch
            blockType='Link'
            contentEditable={contentEditable}
            datas={datas}
            currentIndex={currentIndex}
            html={data.title}
            onInput={onInput}
            text={text}
            setText={setText}
            placeholder='Describe the link'
          />
          <UrlInput
            linkUrl={data.url}
            // onKeyPress={onKeyPress}
            currentIndex={currentIndex}
          />
        </>
      ) : (
        <>
          <a href={data.url} target='_blank' rel='noreferrer'>
            <EditableElementSwitch
              blockType='Link'
              contentEditable={contentEditable}
              datas={datas}
              currentIndex={currentIndex}
              html={data.title}
            />
          </a>
        </>
      )}
    </li>
  );
};

export default EditableLinkBlock;
