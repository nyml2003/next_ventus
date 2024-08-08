import React from 'react'
import { Layout } from '@douyinfe/semi-ui'
import Router from '@/router'
import { routes } from './router/routes'
const EntryLayout = () => {
	const { Header, Footer, Content } = Layout

	return (
		<Layout className="flex flex-col h-screen">
			<Header className="bg-white h-[64px]">Header</Header>
			<Content className="flex-1">
				<Router routes={routes} />
			</Content>
			<Footer className="bg-white h-[64px]">Footer</Footer>
		</Layout>
	)
}

export default EntryLayout
