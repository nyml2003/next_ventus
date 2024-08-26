import { useApi } from '@/hooks/useApi';
import { ApiEnum } from '@/apis';
import React, { useEffect, useState, useRef } from 'react';
import { ArticleInfo, GetArticleListRequest, GetArticleListResponse } from '@/apis/GetArticleList';
import ArticleCard from './ArticleCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { message } from 'antd';
import EmptyList from '@/components/EmptyList';
import { IngoreError } from '@/types';
import NoMoreData from '@/components/NoMoreData';
import { Button, Toast } from '@douyinfe/semi-ui';

enum LoadingState {
  Loading,
  Done,
}

const smoothDelay = 1000;
const VISIBLE_COUNT = 5; // 可视区域内显示的元素数量
const BUFFER_COUNT = 3; // 缓冲区内显示的元素数量

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

interface ArticleListProps {
  height: number;
}

const ArticleList = ({ height }: ArticleListProps) => {
  const [articleList, setArticleList] = useState<GetArticleListResponse>({ results: [], count: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(LoadingState.Done);
  const [loadingMore, setLoadingMore] = useState(true); // could load more
  const observer = useRef<IntersectionObserver | null>(null);
  const articleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [initialComplete, setInitialComplete] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(VISIBLE_COUNT + BUFFER_COUNT);

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

  useEffect(() => {
    console.log('articleList:', articleList.results.map(article => article.id).join(','));
  }, [articleList.results]);

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
      const newRes = res.results.map(article => {
        return {
          ...article,
          title: `${article.title}-${newPage}`,
        };
      });
      return {
        ...prev,
        results: [...prev.results, ...newRes],
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
          } else {
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
    //如果为空
    const container = listRef.current;
    if (!container) return;
    const handleScroll = () => {
      console.log('scroll');
    };
    const obersever = new MutationObserver(() => {
      if (container && container.childElementCount > 0) {
        console.log(container);
        console.log(container.childNodes);
        console.log(container.scrollHeight);
        console.log(container.clientHeight);

        container.addEventListener('scroll', handleScroll);
        requestAnimationFrame(() => {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth',
          });
        });
      }
    });
    obersever.observe(container, { childList: true });
    return () => {
      obersever.disconnect();
      container.removeEventListener('scroll', handleScroll);
    };
  }, [listRef.current]);

  const renderBottom = () => {
    const noMoreDataRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (loading === LoadingState.Done && !loadingMore) {
        //最后一个元素滚动到可视区域;
        if (
          noMoreDataRef.current &&
          listRef.current &&
          listRef.current.scrollHeight > listRef.current.clientHeight
        ) {
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
    const visibleArticles = articleList.results.slice(startIndex, endIndex);

    return (
      <div className='flex flex-col overflow-y-scroll' ref={el => (listRef.current = el)}>
        {visibleArticles.map((article, index) => (
          <div key={article.id} ref={el => (articleRefs.current[startIndex + index] = el)}>
            <ArticleCard article={article} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className='flex flex-col' style={{ height: height }}>
      {renderArticleList()}
      {renderBottom()}
      <Button
        className='fixed bottom-4 right-4'
        onClick={() => {
          console.log(listRef.current);
        }}
        title='scroll to bottom'>
        Scroll to bottom
      </Button>
    </div>
  );
};

export default ArticleList;
