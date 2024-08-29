import { FriendInfo } from '@/apis/GetFriend';
import React from 'react';
import './index.less';
import { Tooltip } from '@douyinfe/semi-ui';
import TypingWriter from '@/components/TypeWriter';

interface FriendItemProps {
  friend: FriendInfo;
  backgroundTheme?: number;
}

const FriendItem = (friendItemProps: FriendItemProps) => {
  const { friend, backgroundTheme } = friendItemProps;
  const theme = backgroundTheme ? backgroundTheme % 7 : 0;
  const [descriptionStatus, setDescriptionStatus] = React.useState<'doing' | 'rollback' | 'done'>(
    'done',
  );
  const themeClass = `friend-card-bg-${theme}`;
  return (
    <div
      className={`w-64 h-32 ${themeClass} relative rounded-lg friend-card select-none hover:scale-105 transition 
            duration-500`}
      onMouseEnter={() => setDescriptionStatus('doing')}
      onMouseLeave={() => setDescriptionStatus('rollback')}>
      <div className='flex flex-row'>
        <img src={friend.avatar} alt={friend.nickname} className='w-20 h-20 rounded-full m-2' />
        <div className='flex flex-col p-2'>
          <p className='text-white text-xs font-light line-clamp-2'>
            <TypingWriter text={friend.description} status={descriptionStatus} />
          </p>
        </div>
      </div>
      <div className='text-xl font-bold absolute bottom-2 right-2'>
        <a href={friend.url} target='_blank' rel='noreferrer'>
          <Tooltip content='Click to visit' className='w-full'>
            <div className='text-sm font-bold  text-white rounded-full px-2 py-1 bg-blue-500'>
              {friend.nickname}
            </div>
          </Tooltip>
        </a>
      </div>
    </div>
  );
};

export default FriendItem;
