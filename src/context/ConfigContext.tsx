import { Config, configService } from "@/services/config";
import { ReactNode, useState, useEffect } from "react";
import { ConfigContext } from "./configContext";

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<Partial<Config>>(configService.getConfig());

  useEffect(() => {
    const localConfig = configService.getConfig();
    setConfigState(localConfig);
  }, []);

  const setConfig = (newConfig: Partial<Config>) => {
    configService.setConfig(newConfig);
    setConfigState(configService.getConfig());
  };

  const clearConfig = () => {
    configService.clear();
    setConfigState({});
  };

  const hasValidConfig = configService.hasValidConfig();

  return (
    <ConfigContext.Provider value={{ config, setConfig, hasValidConfig, clearConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}
