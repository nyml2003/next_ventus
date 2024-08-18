import React from 'react'
import Router from '@/components/Router'
import routes from '@/router'
const App: React.FC = () => {
  return <Router routes={routes} isRoot />
}
export default App
