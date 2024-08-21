import { Layout, Nav } from '@douyinfe/semi-ui';
import React from 'react';
import ArticleList from './ArticleList';

const ArticlePage = () => {
  const { Sider, Content } = Layout;
  return (
    <Layout>
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
      <Content>
        <ArticleList />
      </Content>
    </Layout>
  );
};

export default ArticlePage;
