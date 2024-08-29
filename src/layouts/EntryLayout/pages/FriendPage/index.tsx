import { ApiEnum } from '@/apis';
import { GetFriendRequest, GetFriendResponse } from '@/apis/GetFriend';
import { useApi } from '@/hooks/useApi';
import React, { useEffect, useState } from 'react';
import FriendItem from './FriendItem';

const fetchFriendList = async () => {
  const { api } = useApi();
  const res = await api.request<GetFriendRequest, GetFriendResponse>(ApiEnum.GetFriendList, {});
  return res;
};

const FriendPage: React.FC = () => {
  const [friendList, setFriendList] = useState<GetFriendResponse>([]);
  useEffect(() => {
    fetchFriendList().then(res => {
      setFriendList(res);
    });
  }, []);
  return (
    <div className='flex flex-col items-center justify-center relative overflow-scroll hide-scrollbar h-full'>
      <div className='top-16 absolute max-w-[1024px]'>
        <h1 className='text-2xl font-bold text-center m-32'>友情链接</h1>
        <div className='flex flex-wrap justify-start'>
          {friendList.map((friend, index) => (
            <div
              key={friend.id}
              className='w-full flex justify-center sm:w-1/2 md:w-1/3 lg:w-1/4 p-4'>
              <FriendItem friend={friend} backgroundTheme={index} />
            </div>
          ))}
        </div>
        <div className='h-64'></div>
      </div>
    </div>
  );
};

export default FriendPage;
