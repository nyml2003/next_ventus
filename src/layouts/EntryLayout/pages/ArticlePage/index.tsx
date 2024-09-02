import React, { useState } from 'react';

import ArticleList from './ArticleList';
import { Layout } from '@douyinfe/semi-ui';
import { ArticleInfo, GetArticleListRequest, GetArticleListResponse } from '@/apis/GetArticleList';
import { ApiEnum } from '@/apis';
import useFetch from '@/hooks/useFetch';
import ArticleMenu from './ArticleMenu';
import { ArticleMenuItemProps } from './types';
export interface GetArticleListRawRequest {
  page: number;
  pageSize?: number;
  keyword?: string;
  tag?: string[];
  order_metric?: 'updated_at' | 'created_at' | 'views';
  order_direction?: '' | '-';
}

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

const ArticlePage = () => {
  const { Sider, Content } = Layout;
  const { data, loading, loadingMore, loadMore } = useFetch<
    GetArticleListRawRequest,
    ArticleInfo,
    GetArticleListResponse,
    GetArticleListRawRequest
  >({
    apiEnum: ApiEnum.GetArticleList,
    request: { page: 1, pageSize: 10 },
    transform: getArticleListRequestAdapter,
  });
  const [activeArticle, setActiveArticle] = useState<ArticleMenuItemProps | null>(null);
  const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(null);
  const [articles, setArticles] = useState<ArticleMenuItemProps[]>([]);
  return (
    <Layout className='flex h-full overflow-hidden'>
      <Sider className='w-32 bg-gray-100'>
        <ArticleMenu
          article={articles}
          activeArticle={activeArticle}
          scrollContainer={scrollContainer}
        />
      </Sider>
      <Content className='overflow-hidden'>
        <ArticleList
          data={data}
          loading={loading}
          loadingMore={loadingMore}
          loadMore={loadMore}
          setActiveArticle={setActiveArticle}
          scrollContainer={scrollContainer}
          setScrollContainer={setScrollContainer}
          setArticles={setArticles}
        />
      </Content>
    </Layout>
  );
};

export default ArticlePage;
