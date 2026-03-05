package com.crms.dto;

import lombok.*;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OptimizationRequest {
    private List<UUID> lessonIds;
    private List<UUID> teacherIds;
    private List<UUID> classroomIds;
    private List<UUID> timeSlotIds;
    private boolean softConstraintsEnabled;
}
