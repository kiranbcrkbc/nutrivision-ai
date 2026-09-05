package com.nutrivision.repository;

import com.nutrivision.entity.DeficiencyCategory;
import com.nutrivision.entity.DietType;
import com.nutrivision.entity.FoodItem;
import com.nutrivision.entity.FoodRegion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {

    List<FoodItem> findByCategoryOrderByPriorityAscFoodNameAsc(DeficiencyCategory category);

    @Query("SELECT f FROM FoodItem f WHERE f.category = :category " +
           "AND (:dietType IS NULL OR f.dietType = :dietType OR (:dietType = com.nutrivision.entity.DietType.VEGETARIAN AND f.dietType = com.nutrivision.entity.DietType.VEGAN)) " +
           "AND (:region IS NULL OR f.region = :region OR f.region = com.nutrivision.entity.FoodRegion.GENERAL) " +
           "ORDER BY f.priority ASC, f.foodName ASC")
    List<FoodItem> findFilteredRecommendations(
            @Param("category") DeficiencyCategory category,
            @Param("dietType") DietType dietType,
            @Param("region") FoodRegion region
    );
}
