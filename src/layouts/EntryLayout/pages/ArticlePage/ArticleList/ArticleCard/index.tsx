import { ArticleInfo } from '@/hooks/useApi/apis/GetArticleList'
import { IconEdit, IconEyeOpened, IconPlusCircle } from '@douyinfe/semi-icons'
import { Card } from '@douyinfe/semi-ui'
import React from 'react'
import './index.less'

interface ArticleCardProps {
  article: ArticleInfo
}

const ArticleCard: React.FC<ArticleCardProps> = (props: ArticleCardProps) => {
  const { article } = props
  const { title, description, tags, views, created_at, updated_at } = article
  return (
    <Card
      className='
      cursor-pointer
      mx-16 my-8
      rounded-lg 
      hover:shadow-lg 
       transform transition duration-500 hover:scale-105 typewriter-container'
      header={
        <div className='flex justify-between'>
          <div className='text-xl font-semibold text-gray-800 flex items-center gap-2'>
            <div>{title}</div>
            {tags.map(tag => (
              <span
                key={tag.id}
                className='bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded'>
                {tag.name}
              </span>
            ))}
          </div>
          <div className='text-sm text-gray-500 flex flex-col gap-1'>
            <div className='flex items-center'>
              <IconEyeOpened className='mr-1' />
              Views: {views}
            </div>
            <div className='flex items-center'>
              <IconPlusCircle className='mr-1' />
              Created at: {new Date(created_at).toLocaleDateString()}
            </div>
            <div className='flex items-center'>
              <IconEdit className='mr-1' />
              Updated at: {new Date(updated_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      }
      footer={
        <div className='text-sm text-gray-500 typing-effect multiline h-20'>{description}</div>
      }
    />
  )
}

export default ArticleCard
