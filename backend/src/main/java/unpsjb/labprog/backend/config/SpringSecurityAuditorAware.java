/*package unpsjb.labprog.backend.config;

import java.util.Optional;

import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import unpsjb.labprog.backend.model.Usuario;

class SpringSecurityAuditorAware implements AuditorAware<Usuario> {

  @Override
  public Optional<Usuario> getCurrentAuditor() {

    return Optional.ofNullable(SecurityContextHolder.getContext())
            .map(SecurityContext::getAuthentication)
            .filter(Authentication::isAuthenticated)
            .map(Authentication::getPrincipal)
            .map(Usuario.class::cast);
  }
}*/