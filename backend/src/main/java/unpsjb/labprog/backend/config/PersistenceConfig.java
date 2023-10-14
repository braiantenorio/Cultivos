/*package unpsjb.labprog.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import unpsjb.labprog.backend.model.Usuario;

@EnableJpaAuditing(auditorAwareRef="auditorProvider")
public class PersistenceConfig {
    
    @Bean
    AuditorAware<Usuario> auditorProvider() {
        return new SpringSecurityAuditorAware();
    }
    
}*/