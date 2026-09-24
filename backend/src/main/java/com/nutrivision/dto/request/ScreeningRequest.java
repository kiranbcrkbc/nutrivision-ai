package com.nutrivision.dto.request;
import jakarta.validation.constraints.Size;
import java.util.List;
public class ScreeningRequest {
    @Size(max = 20)
    private List<@Size(max = 240) String> symptoms;
    public List<String> getSymptoms() { return symptoms; }
    public void setSymptoms(List<String> value) { symptoms = value; }
}
