import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { GetArticleListResponse } from '@/apis/GetArticleList';
import ArticleCard from './ArticleCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import NoMoreData from '@/components/NoMoreData';
import { LoadingState } from '@/hooks/useFetch/types';
import { ArticleMenuItemProps } from '../types';
interface ArticleListProps {
  data: GetArticleListResponse;
  loading: LoadingState;
  loadingMore: boolean;
  loadMore: () => void;
  scrollContainer: HTMLDivElement | null;
  setActiveArticle: (article: ArticleMenuItemProps) => void;
  setScrollContainer: (el: HTMLDivElement | null) => void;
  setArticles: (articles: ArticleMenuItemProps[]) => void;
}

const ArticleList: React.FC<ArticleListProps> = ({
  data,
  loading,
  loadingMore,
  loadMore,
  scrollContainer,
  setActiveArticle,
  setScrollContainer,
  setArticles,
}) => {
  const loadMoreObserver = useRef<IntersectionObserver | null>(null);
  const activeObserver = useRef<IntersectionObserver | null>(null);
  const articleRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (loadMoreObserver.current) loadMoreObserver.current.disconnect();
    loadMoreObserver.current = new IntersectionObserver(
      entries => {
        if (
          entries.some(
            entry =>
              entry.isIntersecting &&
              entry.target === articleRefs.current.filter(ref => ref !== null).pop(),
          )
        ) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );
    articleRefs.current.forEach(ref => {
      if (ref) loadMoreObserver.current?.observe(ref);
    });
    return () => loadMoreObserver.current?.disconnect();
  }, [data.results]);

  useEffect(() => {
    if (activeObserver.current) activeObserver.current.disconnect();
    activeObserver.current = new IntersectionObserver(
      entries => {
        entries.find(entry => {
          if (entry.isIntersecting) {
            const articleIndex = articleRefs.current.indexOf(entry.target as HTMLDivElement);
            if (articleIndex !== -1) {
              if (articleIndex < articleRefs.current.length - 1) {
                setActiveArticle({
                  id: data.results[articleIndex + 1].id,
                  title: data.results[articleIndex + 1].title,
                  rect: entry.boundingClientRect,
                  state: null,
                  scrollContainer: null,
                });
              } else {
                setActiveArticle({
                  id: data.results[articleIndex].id,
                  title: data.results[articleIndex].title,
                  rect: entry.boundingClientRect,
                  state: null,
                  scrollContainer: null,
                });
              }
            }
          }
        });
      },
      { threshold: 0, rootMargin: '0px 0px -90% 0px' },
    );
    articleRefs.current.forEach(ref => {
      if (ref) activeObserver.current?.observe(ref);
    });
    return () => activeObserver.current?.disconnect();
  }, [data.results]);

  const renderBottom = useMemo(() => {
    return (
      <div className='flex flex-col'>
        {loading === LoadingState.Loading && <LoadingSpinner />}
        {loading === LoadingState.Done && !loadingMore && <NoMoreData />}
        <div className='h-screen' />
      </div>
    );
  }, [loading, loadingMore]);

  const mountListRef = useCallback((el: HTMLDivElement | null, index: number) => {
    articleRefs.current[index] = el;
  }, []);

  useEffect(() => {
    console.log('articleRefs.current', articleRefs.current);
    setArticles(
      articleRefs.current
        .filter(ref => ref !== null)
        .map((ref, index) => ({
          id: data.results[index].id,
          title: data.results[index].title,
          rect: ref?.getBoundingClientRect(),
          state: null,
          scrollContainer: null,
        })),
    );
  }, [articleRefs.current, data.results, setArticles]);

  const renderArticleList = useMemo(
    () => (
      <div
        className='h-full overflow-y-scroll hide-scrollbar'
        ref={(el: HTMLDivElement) => setScrollContainer(el)}>
        <div>
          {data.results.map((article, index) => (
            <div key={article.id} ref={el => mountListRef(el, index)}>
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
        {renderBottom}
      </div>
    ),
    [data.results, mountListRef, renderBottom],
  );

  return <div className='flex flex-col h-full overflow-hidden'>{renderArticleList}</div>;
};

export default ArticleList;
