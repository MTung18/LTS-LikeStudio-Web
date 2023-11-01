import { useSignalRStore } from "@/stores/signalRStore";

export const signalRPlugin = {
  install: async () => {
    const signalR = useSignalRStore();
    signalR.startSignalRConnection();
  }
}
