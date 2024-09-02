import React, { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { GetArticleListResponse } from '@/apis/GetArticleList';
import ArticleCard from './ArticleCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import NoMoreData from '@/components/NoMoreData';
import { LoadingState } from '@/hooks/useFetch/types';
import { ArticleMenuItemProps } from '../types';
import { debounce } from 'lodash';
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

const ArticleList: React.FC<ArticleListProps> = ({ data, loading, loadingMore, loadMore }) => {
  const [cardMeta, setCardMeta] = useState({
    visibleCount: 7,
    bufferCount: 3,
    itemHeight: 151,
  });
  const [visibleRange, setVisibleRange] = useState({
    start: 0,
    end: cardMeta.visibleCount + cardMeta.bufferCount,
  });
  const [itemHeights, setItemHeights] = useState<number[]>([]);
  const loadMoreObserver = useRef<IntersectionObserver | null>(null);
  const articleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (loadMoreObserver.current) loadMoreObserver.current.disconnect();
    loadMoreObserver.current = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
          const target = entry.target as HTMLDivElement;

          if (
            entry.isIntersecting &&
            target.dataset.id !== undefined &&
            Number(target.dataset.id) === data.results[data.results.length - 1].id
          ) {
            loadMore();
          }
        });
      },
      { threshold: 0.1 },
    );
    articleRefs.current
      .slice(
        Math.max(0, visibleRange.start - cardMeta.bufferCount),
        Math.min(data.results.length, visibleRange.end + cardMeta.bufferCount),
      )
      .forEach(ref => {
        if (ref) loadMoreObserver.current?.observe(ref);
      });
    return () => loadMoreObserver.current?.disconnect();
  }, [data.results, visibleRange]);

  useEffect(() => {
    const handleScroll = () => {
      console.log(itemHeights);
      const container = containerRef.current;
      if (container) {
        const scrollTop = container.scrollTop;
        const itemHeight = cardMeta.itemHeight;
        console.log('scrollTop', scrollTop, 'itemHeight', itemHeight);
        const newStartIndex = Math.max(
          0,
          Math.floor(scrollTop / itemHeight) - cardMeta.bufferCount,
        );
        const newEndIndex = Math.min(
          data.results.length,
          Math.floor(scrollTop / itemHeight) + cardMeta.visibleCount + cardMeta.bufferCount,
        );
        setVisibleRange({ start: newStartIndex, end: newEndIndex });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [itemHeights]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      const newHeights = [...itemHeights];
      let lazyUpdate = false;
      entries.forEach(entry => {
        const index = articleRefs.current.indexOf(entry.target as HTMLDivElement);
        if (index !== -1) {
          newHeights[index] = entry.contentRect.height;
          // 如果差距小于20px，不更新
          console.log(
            `newHeights[${index}]`,
            newHeights[index],
            `entry.contentRect.height`,
            entry.contentRect.height,
          );
          if (Math.abs(newHeights[index] - entry.contentRect.height) < 20) {
            lazyUpdate = true;
          }
        }
      });
      if (!lazyUpdate) return;
      setItemHeights(newHeights);
    });
    articleRefs.current.forEach(ref => {
      if (ref) resizeObserver.observe(ref);
    });

    return () => resizeObserver.disconnect();
  }, [data.results]);

  const renderBottom = useMemo(() => {
    return (
      <div className='flex flex-col'>
        {loading === LoadingState.Loading && <LoadingSpinner />}
        {loading === LoadingState.Done && !loadingMore && <NoMoreData />}
        {/* <div className='h-screen' /> */}
      </div>
    );
  }, [loading, loadingMore]);

  const renderArticleList = useMemo(() => {
    return (
      <div className='h-full overflow-y-scroll hide-scrollbar' ref={containerRef}>
        <div>
          {data.results.slice(visibleRange.start, visibleRange.end).map((article, index) => (
            <div
              key={article.id}
              ref={el => (articleRefs.current[visibleRange.start + index] = el)}
              data-id={article.id}>
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
        {renderBottom}
      </div>
    );
  }, [data.results, renderBottom, visibleRange]);

  useEffect(() => {
    console.log('visibleRange', visibleRange);
  }, [visibleRange]);

  return <div className='flex flex-col h-full overflow-hidden'>{renderArticleList}</div>;
};

export default ArticleList;
