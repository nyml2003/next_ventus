export interface GetArticleListRequest {
  page: number;
  page_size?: number;
  keyword?: string;
  tag?: string[];
  order?: string;
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
