package com.crms.dto;

import lombok.*;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OptimizationResult {
    private String status;
    private double score;
    private List<ScheduledRoutine> suggestions;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ScheduledRoutine {
        private UUID lessonId;
        private UUID teacherId;
        private UUID subjectId;
        private UUID classId;
        private UUID timeSlotId;
        private UUID classroomId;
    }
}
