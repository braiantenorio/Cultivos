package unpsjb.labprog.backend.business;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class NotificacionServiceScheduler {

    private final NotificacionService notificacionService;

    public NotificacionServiceScheduler(NotificacionService notificacionService) {
        this.notificacionService = notificacionService;
    }

    @Scheduled(cron = "0 0 8 * * ?") // Programa la ejecución a las 8:00 AM todos los días
    public void enviarRecordatoriosProgramados() {
        notificacionService.enviarRecordatoriosProcesos();
    }
}