import { create } from "zustand";

export interface AlertType {
  id: string;
  type: "error" | "update";
  message: string;
  timeout?: number;
}

interface AlertState {
  alerts: AlertType[];
  addAlert: (alert: Omit<AlertType, "id">) => void;
  removeAlert: (id: string) => void;
}

export const useAlertStore = create<AlertState>((set, get) => ({
  alerts: [],
  addAlert: (alert) => {
    const alertId = Math.random().toString();

    set((state) => ({
      alerts: [...state.alerts, { ...alert, id: alertId }],
    }));

    setTimeout(() => {
      get().removeAlert(alertId);
    }, alert.timeout || 5000);
  },
  removeAlert: (id) => {
    set((state) => ({
      alerts: state.alerts.filter((alert) => alert.id !== id),
    }));
  },
}));
