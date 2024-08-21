export interface GetArticleListRawRequest {
  page: number;
  pageSize?: number;
  keyword?: string;
  tag?: string[];
  order_metric?: 'updated_at' | 'created_at' | 'views';
  order_direction?: '' | '-';
}

export interface GetArticleListRequest {
  page: number;
  page_size?: number;
  keyword?: string;
  tag?: string[];
  order?: string;
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

export interface GetArticleListResponse {
  count: number;
  next?: string;
  previous?: string;
  results: ArticleInfo[];
}

export interface ArticleInfo {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  tags: Tag[];
  views: number;
}

export interface Tag {
  id: number;
  name: string;
}
