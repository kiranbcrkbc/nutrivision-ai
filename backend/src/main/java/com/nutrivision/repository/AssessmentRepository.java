package com.nutrivision.repository;

import com.nutrivision.entity.Assessment;
import com.nutrivision.entity.AssessmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    List<Assessment> findByUser_UserIdOrderByCreatedAtDesc(Long userId);
    Optional<Assessment> findByAssessmentIdAndUser_UserId(Long assessmentId, Long userId);
    long countByUser_UserId(Long userId);
    long countByStatus(AssessmentStatus status);
    long countByUser_UserIdAndStatus(Long userId, AssessmentStatus status);

    @Query("SELECT a.targetBodyPart, COUNT(a) FROM Assessment a GROUP BY a.targetBodyPart")
    List<Object[]> countGroupedByTargetBodyPart();

    @Query("SELECT a.targetBodyPart, COUNT(a) FROM Assessment a WHERE a.user.userId = :userId GROUP BY a.targetBodyPart")
    List<Object[]> countGroupedByTargetBodyPartForUser(@Param("userId") Long userId);

    List<Assessment> findTop5ByUser_UserIdOrderByCreatedAtDesc(Long userId);
    List<Assessment> findTop5ByOrderByCreatedAtDesc();
}
