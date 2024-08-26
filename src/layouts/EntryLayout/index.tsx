import React, { useEffect, useRef } from 'react';
import { Button, Layout, Nav, Space, Tooltip } from '@douyinfe/semi-ui';
import { Link, Outlet } from 'react-router-dom';
import Router from '@/components/Router';
import routes from './router';
import { IconHome, IconUserGroup, IconArticle, IconGithubLogo } from '@douyinfe/semi-icons';
import IconGame from '@/assets/icons/IconGame';
import { useDarkMode } from '@/hooks/useDarkMode';
function openGithub() {
  window.open('https://github.com/nyml2003');
}
const EntryLayout = () => {
  const { Header, Footer, Content } = Layout;
  const { toggleMode, IconDarkMode, mode } = useDarkMode();
  return (
    <Layout className='flex flex-col h-screen overflow-hidden'>
      <Header className='bg-white shadow-sm flex fixed h-16 w-full z-10'>
        <Nav mode='horizontal' defaultOpenKeys={['home']} className='h-full'>
          <Nav.Header>
            <Space>
              <Link relative='path' to='/home'>
                <Nav.Item icon={<IconHome />} text='Home' itemKey={'home'} />
              </Link>
              <Link to='/friend'>
                <Nav.Item icon={<IconUserGroup />} text='Friends' itemKey={'friends'} />
              </Link>
              <Link to='/article'>
                <Nav.Item icon={<IconArticle />} text='Articles' itemKey={'articles'} />
              </Link>
              <Link to='/game'>
                <Nav.Item icon={<IconGame />} text='Game' itemKey={'game'} />
              </Link>
              <Link to='/test'>
                <Nav.Item icon={<IconGame />} text='Test' itemKey={'test'} />
              </Link>
            </Space>
          </Nav.Header>
          <Nav.Footer>
            <Space>
              {/* <Input placeholder="Search" prefix={<IconSearch />} showClear /> */}
              <Tooltip content={`Swith to ${mode} mode`}>
                <Button
                  icon={
                    <IconDarkMode
                      style={{
                        color: 'var(--semi-color-text-2)',
                      }}
                      size='large'
                    />
                  }
                  theme='borderless'
                  onClick={toggleMode}
                  type='primary'
                />
              </Tooltip>
              <Tooltip content='Github'>
                <Button
                  icon={
                    <IconGithubLogo
                      style={{
                        color: 'var(--semi-color-text-2)',
                      }}
                      size='large'
                    />
                  }
                  theme='borderless'
                  onClick={openGithub}
                  type='primary'
                  size='large'
                />
              </Tooltip>
            </Space>
          </Nav.Footer>
        </Nav>
      </Header>
      <Content className='flex mt-16 flex-col overflow-hidden'>
        <Outlet />
        <Footer className='h-16 flex justify-center items-center bg-white'>
          <div className='text-caption1 text-grey-2'>
            <span className='mr-2'>© 2023 风唤长河</span>
            <a href='http://beian.miit.gov.cn' target='_blank'>
              {'浙ICP备2023031873号 - 1'}
            </a>
          </div>
        </Footer>
      </Content>
    </Layout>
  );
};

export default EntryLayout;
