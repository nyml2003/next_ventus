import { useApi } from '@/hooks/useApi';
import { ApiEnum } from '@/hooks/useApi/apis';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { GetArticleListRequest, GetArticleListResponse } from '@/hooks/useApi/apis/GetArticleList';
import ArticleCard from './ArticleCard';
import { Spin, Toast } from '@douyinfe/semi-ui';

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
);

const ArticleList = () => {
  const { api } = useApi();
  const [articleList, setArticleList] = useState<GetArticleListResponse>({ results: [], count: 0 });
  const [page, setPage] = useState(1);
  const [requestedPages, setRequestedPages] = useState(new Set<number>());
  const [loading, setLoading] = useState(LoadingState.Done);
  const [loadingMore, setLoadingMore] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchArticles = useCallback(() => {
    if (requestedPages.has(page)) return;
    setLoading(LoadingState.Loading);
    Toast.success(`Fetching page ${page}...`);
    const params: GetArticleListRequest = { page, pageSize: 7 };
    api
      .request<GetArticleListRequest, GetArticleListResponse>(ApiEnum.GetArticleList, params)
      .then((res: GetArticleListResponse) => {
        setArticleList(prev => ({
          ...prev,
          results: [...prev.results, ...res.results],
        }));
        setRequestedPages(prev => new Set(prev).add(page));
        setLoading(LoadingState.Done);
      })
      .catch(err => {
        Toast.error(err);
        setLoading(LoadingState.Done);
      });
  }, [api, page, requestedPages]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  useEffect(() => {
    console.log('entering observer effect');
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        Toast.success('the last article is in view');
      }
    });

    const lastArticleCard = document.querySelector('.article-card:last-child');
    if (lastArticleCard) {
      observer.current.observe(lastArticleCard);
    }

    return () => observer.current?.disconnect();
  }, [articleList.results]);

  const renderArticleList = () => {
    return (
      <div className='article-list'>
        {articleList.results.map(article => (
          <ArticleCard key={article.id} article={article} className='article-card' />
        ))}
      </div>
    );
  };

  return (
    <div className='flex flex-col'>
      {renderArticleList()}
      {loading === LoadingState.Loading && LoadingSpinner()}
      {loadingMore && LoadingSpinner('Loading more...')}
    </div>
  );
};

export default ArticleList;
