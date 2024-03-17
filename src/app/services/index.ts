export * from './app.service';
export * from './auth.service';
export * from './user.service';
export * from './message.service';
export * from './loader.service';
export * from './error.service';
export * from './form.service';
export * from './follower.service';
export * from './profile.service';
export * from './post.service';
export * from './like.service';
export * from './save.service';
export * from './comment.service';

export interface Meta {
  totalCount: number;
  pageCount: number;
  currentPage: number;
  perPage: number;
}

export type HistoryEvent = any;
