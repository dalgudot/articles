import { MutableRefObject } from 'react';
import {
  getNewHtml,
  getNodeArray,
  getSelectionEndIndex,
  getSelectionStartIndex,
} from './node';

// selection / range 속성, 메소드 정리 >> https://jungpaeng.tistory.com/86
// https://gdtbgl93.tistory.com/175
export const paste = (
  eachBlockRef: MutableRefObject<HTMLElement>,
  setPasteData: (newHtml: string) => void
) => {
  navigator.clipboard.readText().then((clipText) => {
    // let newHtml: string = '';
    const clipTextLength = clipText.length;
    const eachBlockChildNodes = eachBlockRef.current.childNodes;
    const nodeArray = getNodeArray(eachBlockChildNodes);

    // const eachBlockChildNodesLength = eachBlockRef.current.childNodes.length;
    // console.log('eachBlockChildNodesLength', eachBlockChildNodesLength);

    let isRemovedSomeNode: boolean = false;
    const removeChildNode = (index: number) => {
      // console.log('eachBlockChildNodes', eachBlockChildNodes);
      eachBlockChildNodes[index].remove(); // 실제 노드 삭제
      nodeArray.splice(index, 1); // 내가 만든 배열 요소 삭제
      isRemovedSomeNode = true;
    };

    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);
    const startContainer = range?.startContainer;
    const endContainer = range?.endContainer;
    const startOffset = range?.startOffset;
    const endOffset = range?.endOffset;
    const collapsed = range?.collapsed;
    // console.log('rangeContainer', startContainer, endContainer); // 무조건 왼쪽, 오른쪽
    // console.log('rangeOffset', startOffset, endOffset); // 무조건 왼쪽, 오른쪽
    // console.log('collapsed', collapsed); // 무조건 왼쪽, 오른쪽

    // 정확한 위치에 clipText를 붙여넣으려면?
    // 1) tempEachBlockStateText가 아닌, 즉 전체 텍스트를 이용하는 게 아닌 커서가 있는 노드의 텍스트를 바꿔줘아 한다.
    // 2) 그리고 다시 전체로 구성해줘야 한다.

    // let selectionStartIndex: number = 0;
    let middleNodeCount: number = 0;

    // ***공통*** 아래 함수 속 for문을 통해 마지막 노드(선택 영역 없는 경우 커서 1개) 커서가 있는 노드 식별!
    const selectionEndIndex = getSelectionEndIndex(eachBlockChildNodes);
    console.log('selectionEndIndex', selectionEndIndex);

    // 커서에서 붙여넣기
    if (collapsed === true) {
      const nodeWithCaretTextContent = nodeArray[selectionEndIndex].textContent;
      const nodeWithCaretTextContentArray = nodeWithCaretTextContent?.split('');

      // 배열에서 붙여넣기
      endOffset !== undefined &&
        nodeWithCaretTextContentArray?.splice(endOffset, 0, clipText);

      const textAfterPastedNodeWithCaretIndex =
        nodeWithCaretTextContentArray?.join('');

      nodeArray[selectionEndIndex].textContent =
        textAfterPastedNodeWithCaretIndex;
    }

    // 드래그한 선택 영역 있을 경우
    if (collapsed === false) {
      // 1. 셀렉션 영역 모두 지운다
      // 2. 마지막 노드에 해당 텍스트를 붙여넣는다.
      const selectionStartIndex = getSelectionStartIndex(eachBlockChildNodes);
      console.log('selectionStartIndex', selectionStartIndex);

      // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
      // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
      // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
      if (selectionEndIndex === selectionStartIndex) {
        // 같은 노드에 있다면
        const nodeTextArray =
          nodeArray[selectionEndIndex].textContent?.split('');

        // 선택 영역 삭제
        endOffset !== undefined &&
          startOffset !== undefined &&
          nodeTextArray?.splice(startOffset, endOffset - startOffset);

        // cliptText 붙여넣기
        startOffset !== undefined &&
          nodeTextArray?.splice(startOffset, 0, clipText);

        const finalNodeText = nodeTextArray?.join('');

        nodeArray[selectionEndIndex].textContent = finalNodeText;

        console.log(nodeArray[selectionEndIndex].textContent);
      }
      // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
      // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
      // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
      else if (selectionEndIndex - selectionStartIndex > 0) {
        // Start 노드, 1)텍스트 삭제 2)CODE인데 textContent가 없다면 <code> 노드 삭제
        const startNodeTextArray =
          nodeArray[selectionStartIndex].textContent?.split('');
        const endNodeTextArray =
          nodeArray[selectionEndIndex].textContent?.split('');

        const startNodeArrayLength = startNodeTextArray?.length;

        // Start 노드 선택 영역 삭제
        const startNodeRemoveRange =
          startNodeArrayLength !== undefined &&
          startOffset !== undefined &&
          startNodeArrayLength - startOffset;

        startOffset !== undefined &&
          startNodeRemoveRange !== false &&
          startNodeTextArray?.splice(startOffset, startNodeRemoveRange);

        // 순서는 위 splice 다음
        const startNodeTextArrayAfterRemoveLength = startNodeTextArray?.length; // *** 길이 0일 떄 CODE 요소 삭제하기 위해 필요

        // End 노드, End 노드는 처음부터 endOffset까지 삭제
        // End 노드 영역 삭제
        endOffset !== undefined && endNodeTextArray?.splice(0, endOffset); // End 노드는 처음부터 endOffset까지 삭제

        // 순서는 위 splice 다음
        const endNodeTextArrayAfterRemoveLength = endNodeTextArray?.length; // *** 길이 0일 떄 CODE 요소 삭제하기 위해 필요

        // End 노드 offset 0부터 cliptText 붙여넣기
        endOffset !== undefined && endNodeTextArray?.splice(0, 0, clipText); // End 노드는 0부터 붙여야 함

        // setFinalStartNodeText()만 아래 if문에서 쓰임 -> index 맞추기 위해
        const setFinalStartNodeText = () => {
          const finalStartNodeText = startNodeTextArray?.join('');
          nodeArray[selectionStartIndex].textContent = finalStartNodeText;
        };

        const finalEndNodeText = endNodeTextArray?.join('');
        nodeArray[selectionEndIndex].textContent = finalEndNodeText; // 내가 만든 Array에 textContent 넣기

        const removeMiddleNode = () => {
          // ***중요*** 큰 index부터 시작해야 삭제 순서가 꼬이지 않음 > 큰 index 요소부터 삭제한다는 뜻
          for (let i = selectionEndIndex - 1; i > selectionStartIndex; i--) {
            console.log('i,', i);
            removeChildNode(i);
          }
        };
        // 여기서 removeMiddleNode() 실행시키면 아래 if문 조건에서 selectionEndIndex, selectionStartIndex를 쓸 수 없게 됨.
        // > 각 조건에서 각각 실행시켜줘야 함!
        middleNodeCount = selectionEndIndex - selectionStartIndex - 1;

        // 아래 if문은 위 두 줄 코드를 포함해 start 노드의 텍스트가 없어질 경우 노드 삭제하고, 텍스트가 있을 경우삭제만 하는 코드
        // *** 허나 여기서 index를 바꾸면 위쪽 End 노드 코드에 selectionEndIndex 변화로 영향 끼치기 때문에 End 노드 작업 이후에 여기서!
        if (
          startNodeTextArrayAfterRemoveLength === 0 &&
          nodeArray[selectionStartIndex].nodeName === 'CODE'
        ) {
          // CODE 노드를 삭제하면 기존에 selectionStartIndex, selectionEndIndex를 쓸 수 없게 때문에 2중 if문으로 숫자 계산해서 한꺼번에 처리
          if (
            endNodeTextArrayAfterRemoveLength === 0 &&
            nodeArray[selectionEndIndex].nodeName === 'CODE'
          ) {
            removeMiddleNode();
            removeChildNode(selectionStartIndex);
            removeChildNode(selectionEndIndex - middleNodeCount - 1); // 이미 selectionStartIndex 제거했으므로 -1
          } else {
            removeMiddleNode();
            removeChildNode(selectionStartIndex);
          }
          //
        } else if (
          (finalEndNodeText === '' || finalEndNodeText === ' ') &&
          nodeArray[selectionEndIndex].nodeName === 'CODE'
        ) {
          //
          if (
            startNodeTextArrayAfterRemoveLength === 0 &&
            nodeArray[selectionStartIndex].nodeName === 'CODE'
          ) {
            removeMiddleNode();
            removeChildNode(selectionStartIndex);
            removeChildNode(selectionEndIndex - middleNodeCount - 1); // 이미 selectionStartIndex 제거했으므로 -1
          } else {
            setFinalStartNodeText(); // start 노드 업데이트된 텍스트 여기서는 삭제되지 않으므로, 넣어줘야
            removeMiddleNode();
            removeChildNode(selectionEndIndex - middleNodeCount);
          }
          //
        } else {
          removeMiddleNode(); // 여기선 인덱스가 변하지 않음.
          setFinalStartNodeText(); // 내가 만든 Array에 textContent 넣기
        }
      }

      // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
      // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
      // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
      else {
        throw new Error('Error');
      }
    }

    const newHtml = getNewHtml(nodeArray);
    // console.log('newHtml', newHtml);

    setPasteData(newHtml);

    // setPasteData 데이터 업데이트 이후에 caret 위치 조정
    // 1. 커서 하나일 때, if(collapsed === true)
    if (collapsed) {
      focusCaretAfterClipTextWhenCollapsed(
        eachBlockRef,
        selectionEndIndex,
        clipTextLength,
        startOffset,
        selection
      );
    }

    // 2. 선택 영역이 있을 때, if(collapsed === false)
    if (!collapsed) {
      focusCaretAfterClipTextWhenNotCollapsed();
    }
  });
};

const focusCaretAfterClipTextWhenCollapsed = (
  eachBlockRef: MutableRefObject<HTMLElement>,
  selectionEndIndex: number,
  clipTextLength: number,
  startOffset: number | undefined,
  selection: Selection | null
) => {
  const targetNode =
    eachBlockRef.current.childNodes[selectionEndIndex].nodeName === 'CODE'
      ? eachBlockRef.current.childNodes[selectionEndIndex].childNodes[0]
      : eachBlockRef.current.childNodes[selectionEndIndex];

  const newCaretPosition =
    startOffset !== undefined && startOffset + clipTextLength;

  const newRange = document.createRange();
  newCaretPosition !== false && newRange.setStart(targetNode, newCaretPosition); // 코드 블럭 한 칸 뒤쪽 위치

  selection && selection.removeAllRanges();
  selection && selection.addRange(newRange);
};

const focusCaretAfterClipTextWhenNotCollapsed = () => {
  console.log('!collapsed');
};

// https://jungpaeng.tistory.com/86
// range.startContainer: 범위가 시작하는 부분을 포함하고 있는 노드
// range.endContainter: 범위가 끝나는 부분을 포함하고 있는 노드
// range.startOffset: startContainer에서 범위가 시작하는 지점의 offset
// // // // // startContainer가 TEXT_NODE라면 문자의 갯수
// // // // // startContainer가 ELEMENT_NODE라면 자식 노드의 인덱스
// range.endOffset: endContainer에서 범위가 끝나는 지점의 offset
// // // // // startOffset과 동일한 규칙이 적용
// range.collapsed: Range의 시작점과 끝점이 같은 위치인지 알 수 있는 boolean 값을 반환
