import { createContext, useContext, useState } from "react";

const NotificationsContext = createContext({
  showNotification: (title: string, message?: string, txId?: `0x${string}`, url?: string) => {},
  showError: (title: string, error?: string) => {},
  notification: {
    title: "",
    txId: "",
    error: "",
    type: "success",
    url: "",
    message: "",
  },
  show: false,
  setShow: (show: boolean) => {},
});

export const useNotifications = () => useContext(NotificationsContext);

export const NotificationsProvider = ({ children }: React.PropsWithChildren) => {
  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState({ title: "", txId: "0x", error: "", type: "success", url: "", message: "" });

  const showNotification = (title: string, message: string = "View transaction", txId: `0x${string}` = "0x", url: string = "") => {
    setNotification({
      title,
      txId,
      error: "",
      type: "success",
      url,
      message: message ?? "View transaction",
    });
    setShow(true);
    setTimeout(function () {
      setShow(false);
    }, 8000);
  };

  const showError = (title: string, error = "") => {
    setNotification({
      title,
      txId: "0x",
      error,
      type: "error",
      url: "",
      message: "",
    });
    setShow(true);
    setTimeout(function () {
      setShow(false);
    }, 8000);
  };

  // @ts-ignore
  return (
    <NotificationsContext.Provider value={{ showNotification, showError, notification, show, setShow }}>
      {children}
    </NotificationsContext.Provider>
  );
};
