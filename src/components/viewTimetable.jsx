import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { TableBody, TableHead, TableRow, Paper, Button, Select, MenuItem } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useReactToPrint } from 'react-to-print';
import {
  StyledTable, StyledTableCell, StyledTableContainer,
  StyledTableHeader, StyledTableHeaderCell
} from './timetableStyles';
import Loading from '../pages/loading';
import {times, levels} from '../utils/constants'


const fetchTimetableData = async (selectedLevel) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'timetable'));
    return querySnapshot.docs
      .map(doc => doc.data())
      .filter(classItem => classItem.level === selectedLevel);
  } catch (error) {
    console.error("Error fetching classes:", error);
    return [];
  }
};

const LevelSelector = ({ selectedLevel, onLevelChange }) => (
  <Select
    value={selectedLevel}
    onChange={onLevelChange}
    displayEmpty
    style={{ margin: '20px auto', display: 'block', maxWidth: '80%' }}
  >
    {levels.map(level => (
      <MenuItem key={level} value={level}>
        {level}
      </MenuItem>
    ))}
  </Select>
);

const Timetable = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState('100 Level');
  const tableRef = useRef();
  const { role } = useAuth();

  useEffect(() => {
    setLoading(true);
    fetchTimetableData(selectedLevel).then(classData => {
      setClasses(classData);
      setLoading(false);
    });
  }, [selectedLevel]);

  const classSlots = useMemo(() => times.map(time => ({
    time,
    slots: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => {
      const classItem = classes.find(c => c.day === day && c.startTime === time);
      return { day, classItem };
    })
  })), [classes]);

  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
  });

  const handleLevelChange = (event) => {
    setSelectedLevel(event.target.value);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {(role === 'LECTURER' || role === 'HOD' || role === 'DEAN') && (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '10px' }}>
          <Button variant="contained" color="inherit" onClick={handlePrint}>
            Export as PDF
          </Button>
          <Button variant="contained" color="inherit" component={Link} to="/editTimetable">
            Edit Timetable
          </Button>
          {(role === 'HOD' || role === 'DEAN') && (
            <Button variant="contained" color="inherit" component={Link} to="/approveTimetable">
              Approve Changes
            </Button>
          )}
        </div>
      )}
      <LevelSelector selectedLevel={selectedLevel} onLevelChange={handleLevelChange} />
      <StyledTableContainer component={Paper} style={{ width: '80%', margin: '20px auto' }} ref={tableRef}>
        <StyledTable aria-label="timetable">
          <TableHead>
            <StyledTableHeader>
              <StyledTableHeaderCell>Time</StyledTableHeaderCell>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                <StyledTableHeaderCell key={day}>{day}</StyledTableHeaderCell>
              ))}
            </StyledTableHeader>
          </TableHead>
          <TableBody>
            {classSlots.map(({ time, slots }) => (
              <TableRow key={time}>
                <StyledTableCell style={{ width: '13%', margin: '2px auto' }}>{time}</StyledTableCell>
                {slots.map(({ day, classItem }) => (
                  <StyledTableCell key={day} className={classItem ? 'class-slot-row' : ''}>
                    {classItem ? (
                      <>
                        <strong>{classItem.subject}</strong>
                        <br />
                        {classItem.teacher}
                      </>
                    ) : null}
                  </StyledTableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>
    </>
  );
};

export default Timetable;
