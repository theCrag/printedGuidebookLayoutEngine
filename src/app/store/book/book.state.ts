import { Sheet } from '@/app/models/Sheet';

export interface BookState {
  sheets: Sheet[];
  hasInitialized: boolean;
}

export const initialState: BookState = {
  sheets: [new Sheet(1)],
  hasInitialized: false,
};
