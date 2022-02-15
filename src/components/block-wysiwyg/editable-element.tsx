import classNames from 'classnames';
import DOMPurify from 'dompurify';
import {
  ChangeEvent,
  FC,
  KeyboardEvent,
  MutableRefObject,
  useEffect,
  useState,
} from 'react';
import { addInlineCodeBlock } from '../../lib/utils/editable-block/add-inline-code-block';
import { IParagraphData } from '../../redux-toolkit/model/post-data-model';
import styles from './editable-element.module.scss';

type Props = {
  TagName: 'h1' | 'h2' | 'h3' | 'p' | 'code' | 'figcaption';
  eachBlockRef: MutableRefObject<any>;
  contentEditable: boolean;
  html: string;
  setCurrentBlockTempPostHtmlData: (inputHtml: string) => void;
  setCurrentBlockPostHtmlData: (inputHtml: string) => void;
  onKeyPress?: (e: KeyboardEvent<HTMLElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLElement>) => void;
  addBlockFocusUseEffectDependency?: IParagraphData;
  removeCurrentBlockFocusUseEffectDependency?: IParagraphData;
  placeholder: string;
  customClassName?: string;
};

// 개별로 쓸 수 있도록 만들거나, map()으로 블록 만들 때도 쓸 수 있도록 만든 컴포넌트 > 아마 텍스트에만 쓰일 듯.
const EditableElement: FC<Props> = ({
  TagName,
  eachBlockRef,
  contentEditable = false,
  html,
  setCurrentBlockTempPostHtmlData,
  setCurrentBlockPostHtmlData,
  onKeyPress,
  onKeyDown,
  addBlockFocusUseEffectDependency,
  removeCurrentBlockFocusUseEffectDependency,
  placeholder = '',
  customClassName,
}) => {
  // setCurrentBlockTempPostHtmlData과 setCurrentBlockPostHtmlData는 모두 current index와 관련있으므로 switch에서 처리하고 props로 넘겨받음!

  const [changeCaretPosition, setChangeCaretPosition] = useState<
    number | undefined
  >(undefined);
  const onInput = (
    e: ChangeEvent<HTMLHeadingElement | HTMLParagraphElement>
  ) => {
    e.preventDefault();
    // https://developer.mozilla.org/ko/docs/Web/API/Element/innerHTML
    // innerHtml은 HTML 태그와 관련된 문자열  (&), (<), (>)를 "&amp;", "&lt;" ,"&gt;"로 보관해 inline 코드로 쓰고 싶을 때만 쓸 수 있도록 한다.
    // 텍스트를 쓰는 동안 바로 코드로 바뀌지 않도록 하기 위해서다.
    // <code class="inline__code__block"></code>는 input 이벤트가 아닌 전체 데이터 상태 업데이트를 통해 갖고 있기 때문에 <> 등이 그대로 남아있다.
    // *** 즉 서버에서 데이터로 가져올 때 내가 원하는 부분만 변환이 가능하다.
    // *** input 이벤트로 들어오는 html은 정규식으로 변환됨!
    // *** [KEY] dangerouslySetInnerHTML로 들어가는 html에서 정규식 변환된 "&amp;", "&lt;" ,"&gt;"는 텍스트로, < > &는 실제 html 요소로 렌더링한다!
    const inputHtml = e.target.innerHTML;

    // const checkChromeBug = () => {
    //   const selection = window.getSelection();
    //   if (
    //     selection?.focusNode?.parentNode?.nodeName === 'SPAN' ||
    //     selection?.focusNode?.parentNode?.nodeName === 'FONT'
    //   ) {
    //     e.preventDefault();
    //     const emptyTextNode = document.createTextNode('');
    //     selection?.focusNode?.parentNode?.replaceChild(
    //       emptyTextNode,
    //       emptyTextNode
    //     );
    //   }
    // };
    // checkChromeBug();

    const twoBacktickNodeIndex: number | undefined = addInlineCodeBlock(
      updateDataWithInlineBlock,
      eachBlockRef
    );
    if (twoBacktickNodeIndex !== undefined) {
      setChangeCaretPosition(twoBacktickNodeIndex);
    } else {
      setCurrentBlockTempPostHtmlData(inputHtml); // twoBacktickNodeIndex !== undefined이면 addInlineCodeBlock()의 updateDataWithInlineBlock에서 업데이트하기 때문에 2번 업데이트 할 필요 없음.
    }

    // console.log('inputHtml', inputHtml);
  };

  const updateDataWithInlineBlock = (inputHtml: string) => {
    setCurrentBlockTempPostHtmlData(inputHtml);
    setCurrentBlockPostHtmlData(inputHtml);
  };

  useEffect(() => {
    // onInput 안에서 inlineCodeBlock이 업데이트되기 때문에,
    // onInput에 대한 렌더링이 완전히 끝난 후 여기서 업데이트!
    if (changeCaretPosition !== undefined) {
      const selection = window.getSelection();
      const targetNode =
        eachBlockRef.current.childNodes.length === 2
          ? eachBlockRef.current.childNodes[changeCaretPosition + 1] // 어떤 노드 도 없는 경우에만 length가 2
          : eachBlockRef.current.childNodes[changeCaretPosition + 2]; // 코드 블럭 생기면 2개의 노드가 추가로 생기기 때문

      const newRange = document.createRange();
      newRange.setStart(targetNode, 1); // 코드 블럭 한 칸 뒤쪽 위치

      selection && selection.removeAllRanges();
      selection && selection.addRange(newRange);

      setChangeCaretPosition(undefined); // 초기화
    }
  }, [changeCaretPosition]);

  return (
    <TagName
      ref={eachBlockRef}
      contentEditable={contentEditable}
      suppressContentEditableWarning={contentEditable}
      // *** [KEY] dangerouslySetInnerHTML로 들어가는 html에서 정규식 변환된 "&amp;", "&lt;" ,"&gt;"는 텍스트로, < > &는 html 요소로 렌더링한다!
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
      onInput={onInput}
      onKeyPress={onKeyPress} // optional, 블록 추가
      onKeyDown={onKeyDown} // optional, 블록 삭제
      spellCheck={false}
      placeholder={contentEditable ? placeholder : undefined}
      className={classNames(styles.editable__element, customClassName)}
    />
  );
};

export default EditableElement;
