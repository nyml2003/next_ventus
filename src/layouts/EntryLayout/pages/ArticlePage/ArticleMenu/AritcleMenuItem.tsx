import { ArticleMenuItemProps, ArticleMenuState } from '../types';
import React from 'react';

const ArticleMenuItem: React.FC<ArticleMenuItemProps> = (item: ArticleMenuItemProps) => {
  const { title, state } = item;
  const getActiveClass = () => {
    switch (state) {
      case ArticleMenuState.Active:
        return 'bg-white';
      case ArticleMenuState.Inactive:
        return 'bg-gray-200';
      case ArticleMenuState.ActiveTop:
        return 'bg-gray-200 rounded-br-xl';
      case ArticleMenuState.ActiveBottom:
        return 'bg-gray-200 rounded-tr-xl';
      default:
        return 'bg-gray-200';
    }
  };
  return (
    <div className={`text-black py-2 truncate  ${getActiveClass()}`}>
      <span
        className='cursor-pointer'
        onClick={() => {
          console.log(item.rect);
          item.scrollContainer?.scrollTo({
            top: item.rect?.top - item.rect?.height,
            behavior: 'smooth',
          });
        }}>
        {title}
      </span>
    </div>
  );
};

export default ArticleMenuItem;
