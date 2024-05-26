import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, 
  doc, updateDoc, setDoc, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Select, MenuItem, Button, TextField, Table, TableBody, TableCell, 
  TableHead, TableRow, Paper, Alert } from '@mui/material';
import Loading from '../pages/loading';
import { times, levels } from '../utils/constants';
import useAuth from '../hooks/useAuth';

const fetchTimetableData = async (selectedLevel) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'timetable'));
    return querySnapshot.docs
      .map(doc => ({ ...doc.data(), id: doc.id }))
      .filter(classItem => classItem.level === selectedLevel);
  } catch (error) {
    console.error("Error fetching classes:", error);
    throw error;
  }
};

const EditTimetable = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState('100 Level');
  const [editedClasses, setEditedClasses] = useState({});
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { role, user } = useAuth();
  const navigation = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError('');
    fetchTimetableData(selectedLevel)
      .then(classData => {
        setClasses(classData);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch timetable data.');
        setLoading(false);
      });
  }, [selectedLevel]);

  const handleLevelChange = useCallback((event) => {
    setSelectedLevel(event.target.value);
  }, []);

  const handleClassChange = useCallback((time, day, field, value) => {
    setEditedClasses({
      ...editedClasses,
      [time]: {
        ...editedClasses[time],
        [day]: {
          ...editedClasses[time]?.[day],
          [field]: value,
        },
      },
    });
  }, [editedClasses]);

  const handleSaveChanges = useCallback(async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      if (role === 'LECTURER') {
        // Submit changes to the timetableChanges collection for approval
        const changes = Object.entries(editedClasses).flatMap(([time, days]) =>
          Object.entries(days).map(([day, change]) => ({
            day,
            startTime: time,
            ...change,
            level: selectedLevel,
            submittedBy: user.uid,
            status: 'pending'
          }))
        );

        await Promise.all(changes.map(change => addDoc(collection(db, 'timetableChanges'), change)));
        setSuccessMessage('Changes submitted for approval.');
      } else {
        // Directly update the timetable for DEAN and HOD
        const updates = Object.entries(editedClasses).flatMap(([time, days]) =>
          Object.entries(days).map(async ([day, changes]) => {
            const existingClass = classes.find(c => c.day === day && c.startTime === time);
            if (existingClass) {
              const classRef = doc(db, 'timetable', existingClass.id);
              await updateDoc(classRef, changes);
            } else {
              const newClassRef = doc(collection(db, 'timetable'));
              await setDoc(newClassRef, {
                ...changes,
                day,
                startTime: time,
                level: selectedLevel,
              });
            }
          })
        );

        await Promise.all(updates);
        setSuccessMessage('Changes saved successfully.');
      }

      setEditedClasses({});
      fetchTimetableData(selectedLevel).then(classData => {
        setClasses(classData);
        setLoading(false);
      });
      navigation('/timetable')
    } catch (error) {
      setError('Failed to save changes.');
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editedClasses, selectedLevel, classes, role, user]);

  if (loading) {
    return <Loading />;
  }

  if (!(role === 'DEAN' || role === 'LECTURER' || role === 'HOD')) {
    return <Alert severity="error">You do not have permission to edit the timetable.</Alert>;
  }

  return (
    <>
      <Select
        value={selectedLevel}
        onChange={handleLevelChange}
        displayEmpty
        style={{ margin: '20px auto', display: 'block', maxWidth: '80%' }}
      >
        {levels.map(level => (
          <MenuItem key={level} value={level}>
            {level}
          </MenuItem>
        ))}
      </Select>
      {error && <Alert severity="error" style={{ marginBottom: '20px' }}>{error}</Alert>}
      {successMessage && <Alert severity="success" style={{ marginBottom: '20px' }}>{successMessage}</Alert>}
      <Paper style={{ width: '80%', margin: '20px auto', padding: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                <TableCell key={day}>{day}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {times.map(time => (
              <TableRow key={time}>
                <TableCell>{time}</TableCell>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => {
                  const classItem = classes.find(c => c.day === day && c.startTime === time);
                  return (
                    <TableCell key={day}>
                      <TextField
                        value={editedClasses[time]?.[day]?.subject || classItem?.subject || ''}
                        onChange={(e) => handleClassChange(time, day, 'subject', e.target.value)}
                        placeholder="Subject"
                        fullWidth
                      />
                      <TextField
                        value={editedClasses[time]?.[day]?.teacher || classItem?.teacher || ''}
                        onChange={(e) => handleClassChange(time, day, 'teacher', e.target.value)}
                        placeholder="Teacher"
                        fullWidth
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button variant="contained" color="primary" onClick={handleSaveChanges} style={{ marginTop: '20px' }}>
          Save Changes
        </Button>
      </Paper>
    </>
  );
};

export default EditTimetable;
