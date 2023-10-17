package unpsjb.labprog.backend.business;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.FileDB;


@Repository
public interface FileDBRepository extends JpaRepository<FileDB, String> {

}