import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Button, Alert } from '@mui/material';
import Loading from '../pages/loading';
import useAuth from '../hooks/useAuth';

const fetchPendingChanges = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'timetableChanges'));
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } catch (error) {
    console.error("Error fetching changes:", error);
    return [];
  }
};

const ApproveTimetableChanges = () => {
  const [changes, setChanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { role } = useAuth();

  useEffect(() => {
    setLoading(true);
    fetchPendingChanges().then(changeData => {
      setChanges(changeData);
      setLoading(false);
    }).catch(() => {
      setError('Failed to fetch changes.');
      setLoading(false);
    });
  }, []);

  const handleApproveChange = async (change) => {
    try {
      const classRef = doc(db, 'timetable', change.id);
      await setDoc(classRef, change);
      await deleteDoc(doc(db, 'timetableChanges', change.id));
      setSuccessMessage('Change approved successfully.');
      setChanges(changes.filter(c => c.id !== change.id));
    } catch (error) {
      setError('Failed to approve change.');
    }
  };

  const handleRejectChange = async (changeId) => {
    try {
      await deleteDoc(doc(db, 'timetableChanges', changeId));
      setSuccessMessage('Change rejected successfully.');
      setChanges(changes.filter(c => c.id !== changeId));
    } catch (error) {
      setError('Failed to reject change.');
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!(role === 'DEAN' || role === 'HOD')) {
    return <Alert severity="error">You do not have permission to approve changes.</Alert>;
  }

  return (
    <>
      {error && <Alert severity="error" style={{ marginBottom: '20px' }}>{error}</Alert>}
      {successMessage && <Alert severity="success" style={{ marginBottom: '20px' }}>{successMessage}</Alert>}
      <Paper style={{ width: '80%', margin: '20px auto', padding: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>Day</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Teacher</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {changes.map(change => (
              <TableRow key={change.id}>
                <TableCell>{change.startTime}</TableCell>
                <TableCell>{change.day}</TableCell>
                <TableCell>{change.subject}</TableCell>
                <TableCell>{change.teacher}</TableCell>
                <TableCell>{change.level}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleApproveChange(change)}>
                    Approve
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => handleRejectChange(change.id)} style={{ marginLeft: '10px' }}>
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
};

export default ApproveTimetableChanges;
