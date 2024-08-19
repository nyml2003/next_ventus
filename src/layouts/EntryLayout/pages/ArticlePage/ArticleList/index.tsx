import { useApi } from '@/hooks/useApi'
import { ApiEnum } from '@/hooks/useApi/apis'
import React, { useEffect, useState, useCallback } from 'react'
import { GetArticleListRequest, GetArticleListResponse } from '@/hooks/useApi/apis/GetArticleList'
import ArticleCard from './ArticleCard'
import { Spin, Toast } from '@douyinfe/semi-ui'
import { throttleInterceptor } from '@/hooks/useApi'
import { debounce } from 'lodash'

enum LoadingState {
  Loading,
  Done,
}

const LoadingSpinner = (text = 'Loading...') => (
  <div className='flex justify-center items-center'>
    <div className='flex flex-col items-center mt-16'>
      <Spin size='large'></Spin>
      <div className='text-gray-500 text-sm'>{text}</div>
    </div>
  </div>
)

const ArticleList = () => {
  const { api } = useApi()
  const [articleList, setArticleList] = useState<GetArticleListResponse>({ results: [], count: 0 })
  const [page, setPage] = useState(1)
  const [requestedPages, setRequestedPages] = useState(new Set())
  const [loading, setLoading] = useState(LoadingState.Loading)
  const [loadingMore, setLoadingMore] = useState(false)

  const fetchArticles = useCallback(
    (isLoadMore = false) => {
      if (requestedPages.has(page)) return
      if (isLoadMore) {
        setLoadingMore(true)
      } else {
        setLoading(LoadingState.Loading)
      }
      Toast.success(`Fetching page ${page}...`)
      const params: GetArticleListRequest = { page }
      api
        .request<GetArticleListRequest, GetArticleListResponse>(ApiEnum.GetArticleList, params)
        .then((res: GetArticleListResponse) => {
          const newArticleList = { ...articleList }
          newArticleList.results = [...articleList.results, ...res.results]
          setArticleList(newArticleList)
          setRequestedPages(new Set(requestedPages.add(page)))
        })
        .catch(err => {
          setPage(prevPage => prevPage - 1)
          Toast.error(err)
        })
        .finally(() => {
          if (isLoadMore) {
            setLoadingMore(false)
          } else {
            setLoading(LoadingState.Done)
          }
        })
    },
    [api, page],
  )

  useEffect(() => {
    fetchArticles()
  }, [page])

  useEffect(() => {
    const handleScroll = debounce(() => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 5
      ) {
        setPage(prevPage => prevPage + 1)
        fetchArticles(true)
      }
    }, 100)

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const renderArticleList = () => {
    return articleList.results.map(article => <ArticleCard key={article.id} article={article} />)
  }

  return (
    <div className='flex flex-col'>
      {renderArticleList()}
      {loading === LoadingState.Loading && LoadingSpinner()}
      {loadingMore && LoadingSpinner('Loading more...')}
    </div>
  )
}

export default ArticleList
