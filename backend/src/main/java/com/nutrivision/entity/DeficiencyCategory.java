package com.nutrivision.entity;

public enum DeficiencyCategory {
    IRON_DEFICIENCY("Iron_Deficiency", "Iron Deficiency"),
    VITAMIN_A_DEFICIENCY("Vitamin_A_Deficiency", "Vitamin A Deficiency"),
    VITAMIN_B12_DEFICIENCY("Vitamin_B12_Deficiency", "Vitamin B12 Deficiency"),
    VITAMIN_C_DEFICIENCY("Vitamin_C_Deficiency", "Vitamin C Deficiency"),
    VITAMIN_D_DEFICIENCY("Vitamin_D_Deficiency", "Vitamin D (education only)"),
    ZINC_DEFICIENCY("Zinc_Deficiency", "Zinc Deficiency"),
    HEALTHY_NORMAL("Healthy_Normal", "Healthy / Balanced Baseline");

    private final String code;
    private final String displayName;

    DeficiencyCategory(String code, String displayName) {
        this.code = code;
        this.displayName = displayName;
    }

    public String getCode() {
        return code;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static DeficiencyCategory fromString(String text) {
        if (text == null || text.isBlank()) {
            return HEALTHY_NORMAL;
        }
        String clean = text.trim();
        for (DeficiencyCategory cat : values()) {
            if (cat.name().equalsIgnoreCase(clean.replace("-", "_").replace(" ", "_")) 
                    || cat.code.equalsIgnoreCase(clean) 
                    || cat.displayName.equalsIgnoreCase(clean)) {
                return cat;
            }
        }
        // Partial substring matching
        String upper = clean.toUpperCase();
        if (upper.contains("IRON")) return IRON_DEFICIENCY;
        if (upper.contains("B12") || upper.contains("COBALAMIN")) return VITAMIN_B12_DEFICIENCY;
        if (upper.contains("VITAMIN_A") || upper.contains("VITAMIN A")) return VITAMIN_A_DEFICIENCY;
        if (upper.contains("VITAMIN_C") || upper.contains("VITAMIN C") || upper.contains("SCURVY")) return VITAMIN_C_DEFICIENCY;
        if (upper.contains("ZINC")) return ZINC_DEFICIENCY;
        if (upper.contains("VITAMIN_D") || upper.contains("VITAMIN D")) return VITAMIN_D_DEFICIENCY;

        return HEALTHY_NORMAL;
    }
}
