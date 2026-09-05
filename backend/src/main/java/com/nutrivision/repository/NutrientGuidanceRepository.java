package com.nutrivision.repository;

import com.nutrivision.entity.DeficiencyCategory;
import com.nutrivision.entity.NutrientGuidance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NutrientGuidanceRepository extends JpaRepository<NutrientGuidance, Long> {

    Optional<NutrientGuidance> findByCategory(DeficiencyCategory category);
}
