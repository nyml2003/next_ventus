export interface GetFriendRequest {}
export interface GetFriendResponse extends Array<FriendInfo> {}

export interface FriendInfo {
  id: number;
  nickname: string;
  avatar: string;
  description: string;
  url: string;
  created_at: string;
  updated_at: string;
}
