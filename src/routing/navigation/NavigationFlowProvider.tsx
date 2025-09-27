// src/routing/navigation/NavigationFlowProvider.tsx
// IMPLEMENTATION TARGET: Context provider for navigation flows

import React, { createContext, useContext, useMemo } from 'react';
import { NavigationFlowSystem, NavigationContext, FlowValidationResult } from './NavigationFlowSystem';

interface NavigationFlowContextType {
  navigationSystem: NavigationFlowSystem;
  validateNavigation: (
    fromRoute: string,
    toRoute: string,
    trigger: 'click' | 'filter' | 'search' | 'breadcrumb' | 'canonical',
    context?: NavigationContext
  ) => Promise<FlowValidationResult>;
  getNavigationOptions: (currentRoute: string) => any[];
  setNavigationContext: (context: NavigationContext) => void;
  getNavigationContext: () => NavigationContext;
  generateNavigationLink: (fromRoute: string, toRoute: string, trigger: any, additionalParams?: Record<string, string>) => any;
}

const NavigationFlowContext = createContext<NavigationFlowContextType | null>(null);

export const NavigationFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigationSystem = useMemo(() => new NavigationFlowSystem(), []);

  const contextValue = useMemo<NavigationFlowContextType>(() => ({
    navigationSystem,
    validateNavigation: (fromRoute, toRoute, trigger, context) =>
      navigationSystem.validateNavigation(fromRoute, toRoute, trigger, context),
    getNavigationOptions: (currentRoute) =>
      navigationSystem.getNavigationOptions(currentRoute),
    setNavigationContext: (context) =>
      navigationSystem.setNavigationContext(context),
    getNavigationContext: () =>
      navigationSystem.getNavigationContext(),
    generateNavigationLink: (fromRoute, toRoute, trigger, additionalParams) =>
      navigationSystem.generateNavigationLink(fromRoute, toRoute, trigger, additionalParams)
  }), [navigationSystem]);

  return (
    <NavigationFlowContext.Provider value={contextValue}>
      {children}
    </NavigationFlowContext.Provider>
  );
};

export const useNavigationFlow = (): NavigationFlowContextType => {
  const context = useContext(NavigationFlowContext);
  if (!context) {
    throw new Error('useNavigationFlow must be used within NavigationFlowProvider');
  }
  return context;
};

export default NavigationFlowProvider;