import { FC, ReactNode } from 'react';

interface ContentWrapperProps {
  children: ReactNode;
}

const ContentWrapper: FC<ContentWrapperProps> = ({ children }) => {
  return (
    <div className="content-wrapper">
      <section className="content">
        <main role="main">
          <form>
            <div className="main">
              <div className="container" style={{ paddingBottom: '10px' }}>
                {children}
              </div>
            </div>
          </form>
        </main>
      </section>
    </div>
  );
};

export default ContentWrapper;
