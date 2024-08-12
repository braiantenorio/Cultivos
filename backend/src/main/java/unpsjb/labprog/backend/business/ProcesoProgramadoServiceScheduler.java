package unpsjb.labprog.backend.business;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ProcesoProgramadoServiceScheduler {

    private final ProcesoProgramadoService procesoProgramadoService;

    public ProcesoProgramadoServiceScheduler(ProcesoProgramadoService procesoProgramadoService) {
        this.procesoProgramadoService = procesoProgramadoService;
    }

    @Scheduled(cron = "0 0 8 * * ?") // Programa la ejecución a las 8:00 AM todos los días
    public void crearProcesosProgramadosCantidadIndefinida() {
        procesoProgramadoService.crearProcesosProgramadosCantidadIndefinida();
    }
}
