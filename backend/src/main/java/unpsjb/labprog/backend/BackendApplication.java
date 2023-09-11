package unpsjb.labprog.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import unpsjb.labprog.backend.Response;

@RestController
@EnableJpaAuditing
@SpringBootApplication
public class BackendApplication {

	@GetMapping(value = "/")
	public ResponseEntity home() {
		return Response.response(
			HttpStatus.OK,
			"Server Online",
			"Hello!");
	}

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
