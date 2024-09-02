export enum ArticleMenuState {
  Active,
  Inactive,
  ActiveTop,
  ActiveBottom,
}

export interface ArticleMenuItemProps {
  id: number;
  title: string;
  rect: DOMRect;
  state: ArticleMenuState | null;
  scrollContainer: HTMLDivElement | null;
}
