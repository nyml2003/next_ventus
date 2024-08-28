import React, { useRef, useState, useEffect, forwardRef } from 'react';

import ArticleList from './ArticleList';
import { Layout, Nav } from '@douyinfe/semi-ui';

const ArticlePage = () => {
  const { Sider, Content } = Layout;

  return (
    <Layout className='flex h-full overflow-hidden'>
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
      <Content className='overflow-hidden'>
        <ArticleList />
      </Content>
    </Layout>
  );
};

export default ArticlePage;
