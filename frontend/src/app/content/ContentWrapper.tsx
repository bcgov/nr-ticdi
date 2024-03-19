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
              <div className="container">{children}</div>
            </div>
          </form>
        </main>
      </section>
    </div>
  );
};

export default ContentWrapper;
