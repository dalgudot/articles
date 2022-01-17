import Link from 'next/link';
import styled from 'styled-components';

type Props = {
  category: string;
  order: number;
  content: string;
};

const List: React.FC<Props> = ({ category, order, content }) => {
  const isAdmin = false;
  const url = isAdmin
    ? `/post/${category}/${order}/writing`
    : `/post/${category}/${order}`;

  return (
    <>
      <Li>
        <Link href='/post/[category]/[order]' as={url}>
          <a>
            <h1>List {content}</h1>
          </a>
        </Link>
      </Li>
    </>
  );
};

export default List;

const Li = styled.li``;