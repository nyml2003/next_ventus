import { useApi } from '@/hooks/useApi';
import { ApiEnum } from '@/apis';
import React, { useEffect, useState, useRef } from 'react';
import { GetArticleListRequest, GetArticleListResponse } from '@/apis/GetArticleList';
import ArticleCard from './ArticleCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { message } from 'antd';
import EmptyList from '@/components/EmptyList';
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
  const [loadingMore, setLoadingMore] = useState(true); // could load more
  const observer = useRef<IntersectionObserver | null>(null);
  const articleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [initialComplete, setInitialComplete] = useState(false);
  const refresh = async () => {
    requestedPages.clear();
    setArticleList({ results: [], count: 0 });
    setLoadingMore(true);
    setLoading(LoadingState.Loading);
    setInitialComplete(false);
    setTimeout(async () => {
      await fetchArticles(1);
    }, smoothDelay);
  };

  const fetchArticles = async (newPage: number) => {
    setLoading(LoadingState.Loading);
    if (!loadingMore) {
      setTimeout(() => {
        setLoading(LoadingState.Done);
      }, smoothDelay);
      return;
    }
    if (requestedPages.has(newPage)) return;
    const rawRequest: GetArticleListRawRequest = {
      page: newPage,
      pageSize: 10,
    };
    const pageSize = rawRequest.pageSize || 10;
    const params: GetArticleListRequest = getArticleListRequestAdapter(rawRequest);
    const res = await api.request<GetArticleListRequest, GetArticleListResponse>(
      ApiEnum.GetArticleList,
      params,
    );
    setArticleList(prev => {
      return {
        ...prev,
        results: [...prev.results, ...res.results],
      };
    });
    requestedPages.add(newPage);
    setPage(newPage);
    setInitialComplete(true);
    if (res.results.length < pageSize) {
      setLoadingMore(false);
    } else {
      setLoadingMore(true);
    }
    setLoading(LoadingState.Done);
  };

  const loadMore = async () => {
    try {
      await fetchArticles(page + 1);
    } catch (error: any) {
      if (error instanceof Error) {
        if (error instanceof IngoreError) {
          return;
        }
        message.error(error.message);
      } else {
        message.error('未知错误');
      }
      setLoadingMore(false);
    }
  };

  // 初始化加载第一页
  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            //如果是最后一个元素，加载下一页
            if (entry.target === articleRefs.current[articleRefs.current.length - 1]) {
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
  }, [articleList.results]);

  useEffect(() => {
    const handleScroll = () => {
      // 如果滚动到顶部，加载第一页
      if (listRef?.current?.scrollTop === 0) {
        refresh();
      }
    };
    // 监听 listRef.current 的滚动事件，而不是 window 的滚动事件
    const currentListRef = listRef.current;

    currentListRef?.addEventListener('scroll', handleScroll);

    return () => {
      currentListRef?.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const renderBottom = () => {
    const noMoreDataRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (loading === LoadingState.Done && !loadingMore) {
        if (noMoreDataRef.current) {
          listRef.current?.scrollTo({
            top: listRef.current.scrollHeight + noMoreDataRef.current.clientHeight,
            behavior: 'smooth',
          });
        }
      }
    }, [loading, loadingMore]);

    if (loading === LoadingState.Loading) {
      return <LoadingSpinner />;
    } else if (loading === LoadingState.Done && !loadingMore) {
      return (
        <div ref={noMoreDataRef}>
          <NoMoreData />
        </div>
      );
    }
  };
  const renderArticleList = () => {
    if (articleList?.results?.length > 0) {
      return articleList.results.map((article, index) => (
        <div key={article.id} ref={el => (articleRefs.current[index] = el)}>
          <ArticleCard article={article} />
        </div>
      ));
    } else if (initialComplete) {
      return <EmptyList hasRefresh={true} refresh={refresh} />;
    }
  };

  return (
    <div
      className='flex flex-col overflow-auto h-screen hide-scrollbar'
      ref={el => (listRef.current = el)}>
      {renderArticleList()}
      {renderBottom()}
    </div>
  );
};

export default ArticleList;
