package com.crms.service;

import com.crms.domain.Subject;
import com.crms.domain.Lesson;
import com.crms.repository.SubjectRepository;
import com.crms.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Subject Service
 * Requirements: 6.1, 6.2, 6.3, 6.5, 6.6
 */
@Service
@Transactional
public class SubjectService {

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Cacheable(value = "subjects", key = "#id")
    public Subject getSubjectById(UUID id) {
        return subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found with id: " + id));
    }

    @Cacheable(value = "subjects_by_code", key = "#code")
    public Subject getSubjectByCode(String code) {
        return subjectRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Subject not found with code: " + code));
    }

    @CacheEvict(value = {"subjects", "subjects_by_code"}, allEntries = true)
    public Subject createSubject(Subject subject) {
        validateSubject(subject);
        return subjectRepository.save(subject);
    }

    @CacheEvict(value = {"subjects", "subjects_by_code"}, allEntries = true)
    public Subject updateSubject(UUID id, Subject updatedSubject) {
        Subject subject = getSubjectById(id);
        validateSubject(updatedSubject);

        subject.setCode(updatedSubject.getCode());
        subject.setName(updatedSubject.getName());
        subject.setDescription(updatedSubject.getDescription());
        subject.setCreditHours(updatedSubject.getCreditHours());

        return subjectRepository.save(subject);
    }

    @CacheEvict(value = {"subjects", "subjects_by_code"}, allEntries = true)
    public void deleteSubject(UUID id) {
        Subject subject = getSubjectById(id);

        // Check if subject has active routines
        if (!subject.getRoutines().isEmpty()) {
            throw new RuntimeException("Cannot delete subject with active routines");
        }

        subjectRepository.deleteById(id);
    }

    public Lesson createLesson(UUID subjectId, Lesson lesson) {
        Subject subject = getSubjectById(subjectId);
        lesson.setSubject(subject);
        return lessonRepository.save(lesson);
    }

    public List<Lesson> getLessonsBySubject(UUID subjectId) {
        Subject subject = getSubjectById(subjectId);
        return lessonRepository.findBySubject(subject);
    }

    public Lesson updateLesson(UUID lessonId, Lesson updatedLesson) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + lessonId));

        lesson.setTitle(updatedLesson.getTitle());
        lesson.setDescription(updatedLesson.getDescription());
        lesson.setSequenceNumber(updatedLesson.getSequenceNumber());

        return lessonRepository.save(lesson);
    }

    public void deleteLesson(UUID lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + lessonId));

        if (!lesson.getRoutines().isEmpty()) {
            throw new RuntimeException("Cannot delete lesson with active routines");
        }

        lessonRepository.deleteById(lessonId);
    }

    private void validateSubject(Subject subject) {
        if (subject.getCode() == null || subject.getCode().isEmpty()) {
            throw new IllegalArgumentException("Subject code is required");
        }
        if (subject.getName() == null || subject.getName().isEmpty()) {
            throw new IllegalArgumentException("Subject name is required");
        }
        if (subject.getCreditHours() == null || subject.getCreditHours() <= 0) {
            throw new IllegalArgumentException("Credit hours must be greater than 0");
        }
    }
}
