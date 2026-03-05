import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Modal.css';

const RoutineModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    routineType: 'REGULAR',
    classEntityId: '',
    teacherId: '',
    subjectId: '',
    lessonId: '',
    timeSlotId: '',
    classroomId: ''
  });

  const [refData, setRefData] = useState({
    teachers: [],
    classes: [],
    subjects: [],
    lessons: [],
    classrooms: [],
    timeSlots: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchReferenceData();
    }
  }, [isOpen]);

  const fetchReferenceData = async () => {
    console.log("Fetching reference data...");
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/v1/reference-data', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Ref data received:", response.data);
      setRefData(response.data);
    } catch (err) {
      setError('Failed to load reference data. Make sure you are an Admin or Academic Planner.');
      console.error("Ref data fetch error:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      const payload = {
        routineType: formData.routineType,
        classEntity: { id: formData.classEntityId },
        teacher: { id: formData.teacherId },
        subject: { id: formData.subjectId },
        lesson: { id: formData.lessonId },
        timeSlot: { id: formData.timeSlotId },
        classroom: { id: formData.classroomId }
      };

      await axios.post('/api/v1/routines', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      onSuccess();
      onClose();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to create routine. Check for conflicts.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Filter lessons based on selected subject
  console.log("Rendering modal, isOpen:", isOpen);
  console.log("Current refData:", refData);
  const availableLessons = (refData.lessons || []).filter(l => l.subjectId === formData.subjectId);
  console.log("Available lessons:", availableLessons);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create New Routine</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group row">
            <div className="col">
              <label>Routine Type</label>
              <select name="routineType" value={formData.routineType} onChange={handleChange} required>
                <option value="REGULAR">Regular</option>
                <option value="ADDITIONAL">Additional</option>
                <option value="REMEDIAL">Remedial</option>
              </select>
            </div>
            <div className="col">
              <label>Class</label>
              <select name="classEntityId" value={formData.classEntityId} onChange={handleChange} required>
                <option value="">Select a class...</option>
                {(refData.classes || []).map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group row">
            <div className="col">
              <label>Subject</label>
              <select name="subjectId" value={formData.subjectId} onChange={handleChange} required>
                <option value="">Select a subject...</option>
                {(refData.subjects || []).map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>
            <div className="col">
              <label>Lesson</label>
              <select name="lessonId" value={formData.lessonId} onChange={handleChange} required disabled={!formData.subjectId}>
                <option value="">{formData.subjectId ? 'Select a lesson...' : 'Select a subject first'}</option>
                {(availableLessons || []).map(l => (
                  <option key={l.id} value={l.id}>{l.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group row">
            <div className="col">
              <label>Teacher</label>
              <select name="teacherId" value={formData.teacherId} onChange={handleChange} required>
                <option value="">Select a teacher...</option>
                {(refData.teachers || []).map(t => (
                  <option key={t.id} value={t.id}>{t.firstName} {t.lastName} ({t.code})</option>
                ))}
              </select>
            </div>
            <div className="col">
              <label>Classroom</label>
              <select name="classroomId" value={formData.classroomId} onChange={handleChange} required>
                <option value="">Select a classroom...</option>
                {(refData.classrooms || []).map(r => (
                  <option key={r.id} value={r.id}>{r.name} (Cap: {r.capacity})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Time Slot</label>
            <select name="timeSlotId" value={formData.timeSlotId} onChange={handleChange} required>
              <option value="">Select a time slot...</option>
              {(refData.timeSlots || []).map(ts => (
                <option key={ts.id} value={ts.id}>{ts.dayOfWeek} • {ts.startTime}-{ts.endTime} {ts.label ? `(${ts.label})` : ''}</option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Routine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoutineModal;
