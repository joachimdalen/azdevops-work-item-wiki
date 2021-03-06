import {
  IWorkItemChangedArgs,
  IWorkItemFieldChangedArgs,
  IWorkItemLoadedArgs,
  WorkItemTrackingServiceIds
} from 'azure-devops-extension-api/WorkItemTracking';
import { IExtensionContext } from 'azure-devops-extension-sdk';
export const mockInit = jest.fn();
export const mockRegister = jest.fn();
export const mockGetContributionId = jest.fn().mockReturnValue('someContributionId');
/**
 * This is a minimal mock version to test WorkItemFormGroup
 * for additional mocks please look here:
 * https://github.com/h2floh/azure-dev-ops-react-ui-unit-testing/blob/main/src/__mocks__/azure-devops-extension-sdk.ts
 */

/**
 * Mocked Init Function to return resolve
 */
export function init(): Promise<void> {
  return new Promise((resolve, reject) => resolve(mockInit()));
}

/**
 * Mocked getContributionId returns some Id
 */
export function getContributionId() {
  return mockGetContributionId();
}

/**
 * Type and Accessor for WorkItem events
 */
// tslint:disable-next-line: class-name
type workItemCallBackType = {
  // tslint:disable-next-line: completed-docs
  onFieldChanged: (args: IWorkItemFieldChangedArgs) => Promise<void>;
  // tslint:disable-next-line: completed-docs
  onLoaded: (args: IWorkItemLoadedArgs) => Promise<void>;
  // tslint:disable-next-line: completed-docs
  onUnloaded: (args: IWorkItemChangedArgs) => Promise<void>;
  // tslint:disable-next-line: completed-docs
  onSaved: (args: IWorkItemChangedArgs) => Promise<void>;
  // tslint:disable-next-line: completed-docs
  onReset: (args: IWorkItemChangedArgs) => Promise<void>;
  // tslint:disable-next-line: completed-docs
  onRefreshed: (args: IWorkItemChangedArgs) => Promise<void>;
};

/** Spy eventHook to test WorkItemForm Events */
export let spyWorkItemCallBackAccessor: workItemCallBackType;
/**
 * Mocked register returns empty data structure
 */
export function register(instanceId: string, instance: any) {
  if (instanceId.indexOf('work-item-wiki-control') > -1) {
    spyWorkItemCallBackAccessor = instance;
  }

  mockRegister(instanceId, instance);
}

/**
 * Accessors to Mocked getService methods
 */
export const mockSetFieldValue = jest.fn();
export const mockGetFieldValue = jest.fn();
export const mockGetProject = jest.fn();
export const mockAddToast = jest.fn();
export const mockOpenPanel = jest.fn();
export const mockOpenNewWindow = jest.fn();

/**
 * Mocked getService returns mocked methods
 */
export function getService(contributionId: string) {
  switch (contributionId) {
    case WorkItemTrackingServiceIds.WorkItemFormService:
      return {
        // WorkItemFormService
        setFieldValue: mockSetFieldValue,
        getFieldValue: mockGetFieldValue
      };
    case 'ms.vss-tfs-web.tfs-page-data-service': {
      return {
        getProject: mockGetProject
      };
    }
    case 'ms.vss-tfs-web.tfs-global-messages-service': {
      return {
        addToast: mockAddToast
      };
    }
    case 'ms.vss-features.host-page-layout-service': {
      return {
        openPanel: mockOpenPanel
      };
    }
    case 'ms.vss-features.host-navigation-service': {
      return {
        openNewWindow: mockOpenNewWindow
      };
    }
  }
}

export const mockResize = jest.fn();
export const mockReady = jest.fn();
export const mockGetConfiguration = jest.fn();
export const mockNotifyLoadSucceeded = jest.fn();
export const mockGetExtensionContext = jest.fn().mockReturnValue({
  id: 'as-pub.work-item-wiki',
  publisherId: 'as-pub',
  extensionId: 'work-item-wiki',
  version: '0.1.1'
});
export const mockNotifyLoadFailed = jest.fn();

export function resize(width?: number, height?: number) {
  mockResize(width, height);
}

export function ready() {
  return new Promise(resolve => resolve(mockReady()));
}
export function notifyLoadSucceeded() {
  mockNotifyLoadSucceeded();
}
export function getConfiguration() {
  return mockGetConfiguration();
}
export function getExtensionContext(): IExtensionContext {
  return mockGetExtensionContext();
}
export function notifyLoadFailed(e: Error | string): Promise<void> {
  return new Promise(resolve => resolve(mockNotifyLoadFailed(e)));
}
