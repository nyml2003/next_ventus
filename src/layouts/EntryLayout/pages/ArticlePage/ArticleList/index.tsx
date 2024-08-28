import { useApi } from '@/hooks/useApi';
import { ApiEnum } from '@/apis';
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { GetArticleListRequest, GetArticleListResponse } from '@/apis/GetArticleList';
import ArticleCard from './ArticleCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { message } from 'antd';
import { IngoreError } from '@/types';
import NoMoreData from '@/components/NoMoreData';

enum LoadingState {
  Loading,
  Done,
}

const smoothDelay = 1000;

export interface GetArticleListRawRequest {
  page: number;
  pageSize?: number;
  keyword?: string;
  tag?: string[];
  order_metric?: 'updated_at' | 'created_at' | 'views';
  order_direction?: '' | '-';
}

const { api } = useApi();
const requestedPages = new Set<number>();

export function getArticleListRequestAdapter(
  rawRequest: GetArticleListRawRequest,
): GetArticleListRequest {
  return {
    page: rawRequest.page,
    page_size: rawRequest.pageSize,
    keyword: rawRequest.keyword,
    tag: rawRequest.tag,
    order: rawRequest.order_metric
      ? `${rawRequest.order_direction}${rawRequest.order_metric}`
      : undefined,
  };
}

const ArticleList = () => {
  const [articleList, setArticleList] = useState<GetArticleListResponse>({ results: [], count: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(LoadingState.Done);
  const [loadingMore, setLoadingMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const articleRefs = useRef<(HTMLDivElement | null)[]>([]);

  const refresh = useCallback(async () => {
    requestedPages.clear();
    setArticleList({ results: [], count: 0 });
    setLoadingMore(true);
    await fetchArticles(1);
  }, []);

  const fetchArticles = async (newPage: number) => {
    if (!loadingMore || requestedPages.has(newPage)) return;
    setLoading(LoadingState.Loading);
    const rawRequest: GetArticleListRawRequest = { page: newPage, pageSize: 3 };
    const pageSize = rawRequest.pageSize || 10;
    const params: GetArticleListRequest = getArticleListRequestAdapter(rawRequest);
    try {
      const res = await api.request<GetArticleListRequest, GetArticleListResponse>(
        ApiEnum.GetArticleList,
        params,
      );
      setArticleList(prev => ({
        ...prev,
        results: [
          ...prev.results,
          ...res.results.map(article => ({ ...article, title: `${article.title}-${newPage}` })),
        ],
      }));
      requestedPages.add(newPage);
      setPage(newPage);
      setLoadingMore(res.results.length >= pageSize);
    } catch (error: any) {
      handleError(error);
    } finally {
      setLoading(LoadingState.Done);
    }
  };

  const loadMore = useCallback(async () => {
    try {
      await fetchArticles(page + 1);
    } catch (error: any) {
      handleError(error);
    }
  }, [page, fetchArticles]);

  const handleError = (error: any) => {
    if (error instanceof Error) {
      if (!(error instanceof IngoreError)) {
        message.error(error.message);
      }
    } else {
      message.error('未知错误');
    }
    setLoadingMore(false);
  };

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const lastNotNullArticleRef = articleRefs.current.filter(ref => ref !== null).pop();
            if (entry.target === lastNotNullArticleRef) {
              loadMore();
            }
          }
        });
      },
      { threshold: 0.1 },
    );

    articleRefs.current.forEach(ref => {
      if (ref) observer.current?.observe(ref);
    });

    return () => observer.current?.disconnect();
  }, [articleList.results, loadMore]);

  const renderBottom = useMemo(() => {
    if (loading === LoadingState.Loading) {
      return <LoadingSpinner />;
    } else if (loading === LoadingState.Done && !loadingMore) {
      return <NoMoreData />;
    }
  }, [loading, loadingMore]);

  const mountListRef = useCallback((el: HTMLDivElement | null, index: number) => {
    articleRefs.current[index] = el;
  }, []);

  const renderArticleList = useMemo(
    () => (
      <div className='h-full overflow-y-scroll hide-scrollbar'>
        <div>
          {articleList.results.map((article, index) => (
            <div key={article.id} ref={el => mountListRef(el, index)}>
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
        {renderBottom}
      </div>
    ),
    [articleList.results, mountListRef, renderBottom],
  );

  return <div className='flex flex-col h-full overflow-hidden'>{renderArticleList}</div>;
};

export default ArticleList;
