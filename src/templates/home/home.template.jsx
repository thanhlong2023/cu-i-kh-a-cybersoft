import { Suspense } from 'react'

import { Breadcrumb, Layout, theme } from 'antd'

import AppBar from '~/components/AppBar/AppBar'
import { Outlet } from 'react-router-dom'

import SideBar from '~/components/SideBar/SideBar'

const { Content, Sider } = Layout

function HomeTemplate() {
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()
  return (
    <Layout>
      <Layout>
        <AppBar />
      </Layout>
      <Layout>
        <Sider
          width={200}
          style={{
            background: colorBgContainer
          }}
        >
          <SideBar />
        </Sider>
        <Layout
          style={{
            padding: '0 24px 24px'
          }}
        >
          <Breadcrumb
            style={{
              margin: '50px 0'
            }}
          ></Breadcrumb>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG
            }}
          >
            <Suspense fallback={<p> Loading.... </p>}>
              <Outlet />
            </Suspense>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default HomeTemplate
