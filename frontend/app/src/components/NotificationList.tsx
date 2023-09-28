/* import React, { useState } from "react";
import { IconButton, Badge, Menu, MenuItem } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Notificacion } from "../types/notificacion";

//npm install @mui/material @mui/icons-material
//npm install @emotion/styled

interface NotificationListProps {
  notifications: Notificacion[];
  markAsRead: (index: number) => void;
  navigateToLink: (link: string) => void;
}

export const NotificationList = ({
  notifications,
  markAsRead,
  navigateToLink,
}: NotificationListProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (
    notification: Notificacion,
    index: number
  ) => {
    if (!notification.read) {
      // Marcar como leída solo si no se ha leído previamente
      markAsRead(index);
    }
    navigateToLink(notification.lote);
    setAnchorEl(null); // Cierra el menú de notificaciones
  };

  return (
    <div>
      <IconButton color="inherit" onClick={handleIconClick}>
        <Badge
          badgeContent={notifications.filter((n) => !n.read).length}
          color="error"
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {notifications.map((notification, index) => (
          <MenuItem
            key={index}
            onClick={() => handleNotificationClick(notification, index)}
            style={{
              fontWeight: notification.read ? "normal" : "bold",
              color: notification.read ? "#333" : "black",
              marginBottom: "16px",
            }}
          >
            {notification.mensaje}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
*/
export {};
