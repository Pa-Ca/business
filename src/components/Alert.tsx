import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";

import { alertService, AlertType, AlertProps, defaultId } from "services";

function Alert({ id = defaultId, fade = true }: AlertProps) {
  const mounted = useRef(false);
  const router = useRouter();
  const [alerts, setAlerts] = useState<AlertProps[]>([]);

  function omit(arr: AlertProps[], key: keyof AlertProps) {
    return arr.map((obj) => {
      const { [key]: omitted, ...rest } = obj;
      return rest;
    });
  }

  function removeAlert(alert: AlertProps) {
    if (!mounted.current) return;

    if (fade) {
      // fade out alert
      setAlerts((alerts) =>
        alerts.map((x) =>
          x.itemId === alert.itemId ? { ...x, fade: true } : x
        )
      );

      // remove alert after faded out
      setTimeout(() => {
        setAlerts((alerts) => alerts.filter((x) => x.itemId !== alert.itemId));
      }, 250);
    } else {
      // remove alert
      setAlerts((alerts) => alerts.filter((x) => x.itemId !== alert.itemId));
    }
  }

  function cssClasses(alert: AlertProps) {
    if (!alert) return;

    const classes = ["alert", "alert-dismissable"];

    const alertTypeClass = {
      [AlertType.Success]: "alert-success",
      [AlertType.Error]: "alert-danger",
      [AlertType.Info]: "alert-info",
      [AlertType.Warning]: "alert-warning",
    };

    classes.push(alertTypeClass[alert.type!]);

    if (alert.fade) {
      classes.push("fade");
    }

    return classes.join(" ");
  }

  useEffect(() => {
    mounted.current = true;

    // subscribe to new alert notifications
    const subscription = alertService.onAlert(id).subscribe((alert) => {
      // clear alerts when an empty alert is received
      if (!alert.message) {
        setAlerts((alerts) => {
          // filter out alerts without 'keepAfterRouteChange' flag
          const filteredAlerts = alerts.filter((x) => x.keepAfterRouteChange);

          // remove 'keepAfterRouteChange' flag on the rest
          return omit(filteredAlerts, "keepAfterRouteChange");
        });
      } else {
        // add alert to array with unique id
        alert.itemId = Math.random();
        setAlerts((alerts) => [...alerts, alert]);

        // auto close alert if required
        if (alert.autoClose) {
          setTimeout(() => removeAlert(alert), 3000);
        }
      }
    });

    // clear alerts on location change
    const clearAlerts = () => alertService.clear(id);
    router.events.on("routeChangeStart", clearAlerts);

    // clean up function that runs when the component unmounts
    return () => {
      mounted.current = false;

      // unsubscribe to avoid memory leaks
      subscription.unsubscribe();
      router.events.off("routeChangeStart", clearAlerts);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!alerts.length) return null;

  return (
    <div
      style={{
        left: "50%",
        zIndex: 9999,
        bottom: "5vh",
        maxWidth: "50%",
        position: "fixed",
        transform: "translateX(-50%)",
      }}
    >
      {alerts.map((alert, index) => (
        <div key={index} className={cssClasses(alert)}>
          <a
            className="close"
            onClick={() => removeAlert(alert)}
            style={{ cursor: "pointer" }}
          >
            &nbsp;&nbsp;&nbsp;&times;
          </a>
          <span dangerouslySetInnerHTML={{ __html: alert.message! }}></span>
        </div>
      ))}
    </div>
  );
}

Alert.propTypes = {
  id: PropTypes.string,
  fade: PropTypes.bool,
};

Alert.defaultProps = {
  id: "default-alert",
  fade: true,
};

export { Alert as default };
