import { Subject } from "rxjs";
import { filter } from "rxjs/operators";

/**
 * Enumeration of possible alert types.
 */
export enum AlertType {
  Success = "Success",
  Error = "Error",
  Info = "Info",
  Warning = "Warning",
}

/**
 * Interface representing an alert.
 */
export interface AlertProps {
  /**
   * The unique identifier for the alert.
   */
  itemId?: number;
  /**
   * Indicator of the component to which the alert is directed
   */
  id?: string;
  /**
   * Whether the alert should automatically close after a certain time.
   */
  autoClose?: boolean;
  /**
   * The type of the alert.
   */
  type?: AlertType;
  /**
   * The message to display in the alert.
   */
  message?: string;
  /**
   * Indicates if the alert should be kept after a route change.
   */
  keepAfterRouteChange?: boolean;
  /**
   * Indicates if the alert should fade out.
   */
  fade?: boolean;
}

export const defaultId = "default-alert";
const alertSubject = new Subject<AlertProps>();

// enable subscribing to alerts observable
function onAlert(id: string = defaultId) {
  return alertSubject.asObservable().pipe(filter((x) => x && x.id === id));
}

// core alert method
function alert(alert: AlertProps) {
  alert.id = alert.id || defaultId;
  alert.autoClose = alert.autoClose === undefined ? true : alert.autoClose;
  alertSubject.next(alert);
}

// convenience methods
function success(message: string, options?: AlertProps) {
  alert({ ...options, type: AlertType.Success, message });
}

function error(message: string, options?: AlertProps) {
  alert({ ...options, type: AlertType.Error, message });
}

function info(message: string, options?: AlertProps) {
  alert({ ...options, type: AlertType.Info, message });
}

function warn(message: string, options?: AlertProps) {
  alert({ ...options, type: AlertType.Warning, message });
}

// clear alerts
function clear(id: string = defaultId) {
  alertSubject.next({ id });
}

export const alertService = {
  onAlert,
  success,
  error,
  info,
  warn,
  alert,
  clear,
};
