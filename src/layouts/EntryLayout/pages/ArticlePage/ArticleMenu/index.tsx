import React from 'react';
import { ArticleMenuItemProps, ArticleMenuState } from '../types';
import ArticleMenuItem from './AritcleMenuItem';

interface ArticleMenuProps {
  article: ArticleMenuItemProps[];
  activeArticle: ArticleMenuItemProps | null;
  scrollContainer: HTMLDivElement | null;
}
const ArticleMenu: React.FC<ArticleMenuProps> = ({ article, activeArticle, scrollContainer }) => {
  const activeArticleIndex = activeArticle
    ? article.findIndex(item => item.id === activeArticle.id)
    : -1;
  const getArticleMenuItemState = (index: number) => {
    if (index === activeArticleIndex) {
      return ArticleMenuState.Active;
    }
    if (index === activeArticleIndex - 1) {
      return ArticleMenuState.ActiveTop;
    }
    if (index === activeArticleIndex + 1) {
      return ArticleMenuState.ActiveBottom;
    }
    return ArticleMenuState.Inactive;
  };
  const articleMenuItems = article.map((article, index) => {
    return {
      ...article,
      state: getArticleMenuItemState(index),
      scrollContainer,
    };
  });
  return (
    <div className='bg-white select-none'>
      {articleMenuItems.map((article, index) => (
        <ArticleMenuItem key={article.id} {...article} />
      ))}
    </div>
  );
};

export default ArticleMenu;
