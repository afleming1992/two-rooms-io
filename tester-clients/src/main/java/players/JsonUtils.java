package players;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.JSONException;
import org.json.JSONObject;

public class JsonUtils {

  public static JSONObject convertToJsonObject(Object object) {
    ObjectMapper mapper = new ObjectMapper();
    try {
      return new JSONObject(mapper.writeValueAsString(object));
    } catch (JSONException | JsonProcessingException e) {
      e.printStackTrace();
      return new JSONObject();
    }
  }
}
