import { IonIcon } from '@ionic/react';
import {
  checkmarkDoneOutline,
  closeOutline,
  notificationsOutline,
} from 'ionicons/icons';

import type { Notification } from '../../services/notificationService';
import './NotificationPanel.css';

interface NotificationPanelProps {
  notifications: Notification[];
  onClose: () => void;
  onRead: (id: number) => void;
}

function NotificationPanel({
  notifications,
  onClose,
  onRead,
}: NotificationPanelProps) {
  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('es-DO', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="notification-overlay" onClick={onClose}>
      <aside
        className="notification-panel"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="notification-panel-header">
          <div>
            <h2>Notificaciones</h2>

            <span>
              {unreadCount > 0
                ? `${unreadCount} sin leer`
                : 'Todo al día'}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <IonIcon icon={closeOutline} />
          </button>
        </header>

        <div className="notification-list">
          {notifications.length === 0 ? (
            <div className="notification-empty">
              <IonIcon icon={notificationsOutline} />
              <h3>No tienes notificaciones</h3>
              <p>Cuando haya novedades aparecerán aquí.</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <article
                key={notification.id}
                className={`notification-item ${
                  notification.is_read ? 'read' : 'unread'
                }`}
                onClick={() => {
                  if (!notification.is_read) {
                    onRead(notification.id);
                  }
                }}
              >
                <div className="notification-item-content">
                  <strong>{notification.title}</strong>
                  <p>{notification.message}</p>
                  <span>{formatDate(notification.created_at)}</span>
                </div>

                {!notification.is_read && (
                  <button
                    type="button"
                    className="notification-read-button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onRead(notification.id);
                    }}
                    aria-label="Marcar como leída"
                  >
                    <IonIcon icon={checkmarkDoneOutline} />
                  </button>
                )}
              </article>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}

export default NotificationPanel;