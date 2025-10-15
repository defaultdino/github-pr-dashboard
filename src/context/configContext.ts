import { createContext, useContext } from "react";
import { Config } from "@/services/config";

export type ConfigContextValue = {
  config: Partial<Config>;
  setConfig: (config: Partial<Config>) => void;
  hasValidConfig: boolean;
  clearConfig: () => void;
}

export const ConfigContext = createContext<ConfigContextValue | undefined>(undefined);

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
