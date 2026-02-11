import { create } from 'zustand'; // Agar zustand use kar rahe ho, warna plain object logic

export const store = {
  state: {
    user: {
      name: "User",
      instagram_connected: false,
      message_count: 0,
      username: ""
    },
    automations: [],
    contacts: [], // Yahan se Sarah/Mike gayab
    flows: [],
  },

  // Methods
  getUser: () => store.state.user,
  getAutomations: () => store.state.automations,
  getContacts: () => store.state.contacts,
  getFlows: () => store.state.flows,

  connectInstagram: (username: string, token: string) => {
    store.state.user = {
      ...store.state.user,
      instagram_connected: true,
      username: username
    };
    store.notify();
  },

  // Store update logic
  subscribers: [] as Function[],
  subscribe: (fn: Function) => {
    store.subscribers.push(fn);
    return () => {
      store.subscribers = store.subscribers.filter(s => s !== fn);
    };
  },
  notify: () => {
    store.subscribers.forEach(fn => fn());
  }
};
