package unpsjb.labprog.backend.business;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import unpsjb.labprog.backend.model.Notificacion;
import unpsjb.labprog.backend.model.Usuario;
import java.util.Map;
import unpsjb.labprog.backend.DTOs.ProcesoProgramadoDTO;

@Service
public class NotificacionService {

	@Autowired
	NotificacionRepository repository;

    @Autowired
    private IEmailService emailService;

    @Autowired
    private ProcesoProgramadoService procesoProgramadoService;

    @Autowired
    private UsuarioService usuarioService;

	//TODO: Mejorar
	public List<Notificacion> findAll() {
		List<Notificacion> result = new ArrayList<>();
		repository.findAll().forEach(e -> result.add(e));
		return result;
	}
    @Transactional
	public Notificacion add(Notificacion notificacion) {
		return repository.save(notificacion);
	}
    @Transactional
	public Notificacion update(Notificacion  notificacion) {
		return repository.save( notificacion);
	}

	public Notificacion findById(long id) {
		return repository.findById(id).orElse(null);
	}

    public void enviarRecordatoriosProcesos() {

    Map<String, List<ProcesoProgramadoDTO>> procesosPorEmail = procesoProgramadoService.obtenerProcesosProgramados();
    
    procesosPorEmail.forEach((email, procesosUsuario) -> {
        String subject = "Recordatorio de Procesos";
        String saludo = "Hola " + procesosUsuario.get(0).getNombre() + ",";
        
    
        Usuario usuario = usuarioService.obtenerUsuarioPorEmail(email);
      
        for (ProcesoProgramadoDTO proceso : procesosUsuario) {
       
            String mensaje = "Proceso: " + proceso.getProceso() + "\n" + "Lote: " + proceso.getLote();

            Notificacion notificacion = new Notificacion();
            notificacion.setMensaje(mensaje);
            notificacion.setLote(proceso.getLote()); 

            
            usuario.addNotificacion(add(notificacion));
        }
        usuarioService.update(usuario);

      
        StringBuilder message = new StringBuilder(saludo + "\n\n");
        procesosUsuario.forEach(proceso -> {
            message.append("Proceso: ").append(proceso.getProceso()).append("\n");
            message.append("Lote: ").append(proceso.getLote()).append("\n\n");
        });
        emailService.sendEmail(new String[] { email }, subject, message.toString());
    });
}

    
}