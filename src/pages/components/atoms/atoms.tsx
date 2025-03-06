import { atom } from 'recoil';

export const headerPageState = atom({
  key: 'page',
  default: 'main',
});

export const headerQueryState = atom({
  key: 'query',
  default: '',
});