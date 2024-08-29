import { RouteObject } from 'react-router-dom';
import EntryLayout from '@/layouts/EntryLayout';
import NotFoundLayout from '@/layouts/NotFoundLayout';
import React from 'react';
import GamePage from '@/layouts/EntryLayout/pages/GamePage';
import TestPage from '@/layouts/EntryLayout/pages/TestPage';
import ArticlePage from '@/layouts/EntryLayout/pages/ArticlePage';
import FriendPage from '@/layouts/EntryLayout/pages/FriendPage';
const routes: RouteObject[] = [
  {
    path: '/',
    element: <EntryLayout />,
    children: [
      {
        path: 'game',
        element: <GamePage />,
      },
      {
        path: 'test',
        element: <TestPage />,
      },
      {
        path: 'article',
        element: <ArticlePage />,
      },
      {
        path: 'friend',
        element: <FriendPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundLayout />,
  },
];

export default routes;
