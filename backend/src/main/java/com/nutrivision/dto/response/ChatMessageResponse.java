package com.nutrivision.dto.response;

import java.util.List;

public class ChatMessageResponse {

    private String reply;
    private String intentCategory;
    private List<String> suggestions;
    private String disclaimer;
    private boolean isEmergency;

    public ChatMessageResponse() {}

    public ChatMessageResponse(String reply, String intentCategory, List<String> suggestions, String disclaimer, boolean isEmergency) {
        this.reply = reply;
        this.intentCategory = intentCategory;
        this.suggestions = suggestions;
        this.disclaimer = disclaimer;
        this.isEmergency = isEmergency;
    }

    public String getReply() { return reply; }
    public void setReply(String reply) { this.reply = reply; }

    public String getIntentCategory() { return intentCategory; }
    public void setIntentCategory(String intentCategory) { this.intentCategory = intentCategory; }

    public List<String> getSuggestions() { return suggestions; }
    public void setSuggestions(List<String> suggestions) { this.suggestions = suggestions; }

    public String getDisclaimer() { return disclaimer; }
    public void setDisclaimer(String disclaimer) { this.disclaimer = disclaimer; }

    public boolean isEmergency() { return isEmergency; }
    public void setEmergency(boolean emergency) { isEmergency = emergency; }
}
