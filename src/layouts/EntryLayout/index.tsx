import React from 'react'
import { Button, Layout, Nav, Space, Tooltip } from '@douyinfe/semi-ui'
import { Link, Outlet } from 'react-router-dom'
import Router from '@/components/Router'
import routes from './router'
import { IconHome, IconUserGroup, IconArticle, IconGithubLogo } from '@douyinfe/semi-icons'
import IconGame from '@/assets/icons/IconGame'
import { useDarkMode } from '@/hooks/useDarkMode'
function openGithub() {
  window.open('https://github.com/nyml2003')
}
const EntryLayout = () => {
  const { Header, Footer, Content } = Layout
  const { toggleMode, IconDarkMode, mode } = useDarkMode()
  return (
    <Layout className='flex flex-col h-screen'>
      <Header>
        <Nav mode='horizontal' defaultOpenKeys={['home']}>
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
      <Content className='flex-1'>
        <Router routes={routes} />
        <Outlet />
      </Content>
      <Footer>Footer</Footer>
    </Layout>
  )
}

export default EntryLayout
