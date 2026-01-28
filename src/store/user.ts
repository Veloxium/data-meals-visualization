import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type UserData = {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
};

interface UserStore {
    user: UserData;
    setUser: (user: UserData) => void;
    clearUser: () => void;
}

export const useUserStore = create(
    persist<UserStore>(
        (set) => ({
            user: {},
            setUser: (user) => set({ user }),
            clearUser: () => set({ user: {} }),
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);