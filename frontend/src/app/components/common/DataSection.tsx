/**
 * This is a small component that outlines data containing divs with an orange border if they are empty
 */
import { FC } from 'react';

interface DataSectionProps {
  id?: string;
  content: string | number | null;
}

const DataSection: FC<DataSectionProps> = ({ id, content }) => {
  const isEmpty = !content || content === 'TBD';
  const shouldHide = isEmpty && (id === 'mailingAddress2' || id === 'mailingAddress3');
  const style = shouldHide ? { display: 'none' } : isEmpty ? { border: 'solid 1px orange' } : {};

  return id ? (
    <div className="dataSection" id={id} style={style}>
      {isEmpty ? '\u00A0' : content}
    </div>
  ) : (
    <div className="dataSection" style={style}>
      {isEmpty ? '\u00A0' : content}
    </div>
  );
};

export default DataSection;
