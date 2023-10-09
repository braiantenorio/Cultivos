package unpsjb.labprog.backend.business;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Role;
import unpsjb.labprog.backend.model.ERole;


@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    
  Optional<Role> findByName(ERole name);
}