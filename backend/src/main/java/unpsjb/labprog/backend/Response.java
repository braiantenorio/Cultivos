package unpsjb.labprog.backend;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

public class Response {

	public static ResponseEntity<Object> response(HttpStatus status, String message, Object responseObj) {
		Map<String, Object> map = new HashMap<String, Object>();
		
		map.put("status", status.value());
		map.put("message", message);		
		map.put("data", responseObj);

		return new ResponseEntity<Object>(map,status);
	}

}