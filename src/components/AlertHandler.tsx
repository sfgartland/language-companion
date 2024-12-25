import { downloadAndInstallUpdate } from "@/updater/Updater";
import { AlertType, useAlertStore } from "@/zustand/AlertStore";
import { useUpdaterUIState } from "@/zustand/UpdaterUIStore";
import { Alert, Button } from "@nextui-org/react";

export const AlertHandler = () => {
  const { alerts } = useAlertStore();

  return (
    <div className="fixed bottom-10 right-10 z-50 p-5 flex flex-col-reverse gap-5 max-w-screen-md w-screen">
      {alerts.map((alert) => {
        switch (alert.type) {
          case "error":
            return <ErrorAlert alert={alert} />;
            case "update":
                return <UpdateAlert alert={alert} />;
          default:
            return null;
        }
      })}
    </div>
  );
};

const ErrorAlert = ({ alert }: { alert: AlertType }) => {
  const { removeAlert } = useAlertStore();
  return (
    <Alert
      key={alert.id}
      className=" w-screen"
      title="Error"
      description={alert.message}
      color="danger"
      onClose={() => removeAlert(alert.id)}
    />
  );
};


const UpdateAlert = ({ alert }: { alert: AlertType }) => {
    const { removeAlert } = useAlertStore();
    const { foundUpdate } = useUpdaterUIState();
    return foundUpdate ? (
      <Alert
        key={alert.id}
        className=" w-screen"
        title="Update available"
        description="Found an update, click the button to update the app."
        color="primary"
        onClose={() => removeAlert(alert.id)}
        endContent={
          <Button onPress={() => downloadAndInstallUpdate(foundUpdate)} variant="light">
            Update
          </Button>
        }
      />
    ) : (
      <ErrorAlert
        alert={{
          id: alert.id,
          type: "error",
          message: "Something went wrong while checking for updates!",
        }}
      />
    );
  };