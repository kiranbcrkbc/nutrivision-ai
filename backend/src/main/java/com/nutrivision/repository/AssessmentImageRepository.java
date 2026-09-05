package com.nutrivision.repository;

import com.nutrivision.entity.AssessmentImage;
import com.nutrivision.entity.QualityStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssessmentImageRepository extends JpaRepository<AssessmentImage, Long> {
    List<AssessmentImage> findByAssessment_AssessmentId(Long assessmentId);
    long countByQualityStatus(QualityStatus qualityStatus);

    @Query("SELECT i.qualityStatus, COUNT(i) FROM AssessmentImage i GROUP BY i.qualityStatus")
    List<Object[]> countGroupedByQualityStatus();
}
