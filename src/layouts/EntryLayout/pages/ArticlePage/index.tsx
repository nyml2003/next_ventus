import React, { useRef, useState, useEffect, forwardRef } from 'react';

import ArticleList from './ArticleList';
import { Layout, Nav } from '@douyinfe/semi-ui';

const ArticlePage = () => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const { Sider, Content } = Layout;
  const ForwardedContent = forwardRef<HTMLDivElement, any>((props, ref) => (
    <Content {...props} ref={ref} />
  ));
  useEffect(() => {
    if (contentRef.current) {
      console.log(contentRef.current);
      setContentHeight(contentRef.current.clientHeight);
    }
  }, []);

  return (
    <Layout className='flex'>
      <Sider className='bg-white'>
        <Nav mode='vertical' defaultOpenKeys={['home']}>
          <Nav.Header>
            <div className='h-32'></div>
          </Nav.Header>
          <Nav.Footer>
            <Nav.Item text='Article' />
          </Nav.Footer>
        </Nav>
      </Sider>
      <ForwardedContent ref={contentRef}>
        <ArticleList height={contentHeight} />
      </ForwardedContent>
    </Layout>
  );
};

export default ArticlePage;
