import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ClassDetailPage = () => {
  const [groupSize, setGroupSize] = useState('');
  const [groupName, setGroupName] = useState('');
  const [randomGroup, setRandomGroup] = useState(null);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/class/3/student-list`);
        const studentList = response.data;
        setStudents(studentList);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sinh viên:', error);
      }
    };
    fetchStudents();
  }, [3]);

  const generateRandomGroup = () => {
    if (!groupSize || isNaN(groupSize) || groupSize <= 0) {
      setError('Vui lòng nhập một số nguyên dương.');
      return;
    }

    if (groupSize > students.length) {
      setError('Không đủ sinh viên để tạo nhóm.');
      return;
    }

    const randomGroupMembers = [];
    const shuffledStudents = students.sort(() => 0.5 - Math.random());

    for (let i = 0; i < groupSize; i++) {
      const student = shuffledStudents[i];
      if (!randomGroupMembers.includes(student.accountId)) {
        randomGroupMembers.push(student.accountId);
      }
    }

    const finalGroupName = groupName.trim() || `Group ${Math.floor(Math.random() * 6) + 1}`;

    const randomGroup = {
      groupName: finalGroupName,
      members: randomGroupMembers
    };

    setRandomGroup(randomGroup);
    setError('');
  };

  const saveRandomGroup = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/class/random-group', randomGroup);
      if (response.status === 200) {
        setSuccessMessage('Đã lưu nhóm ngẫu nhiên thành công.');
      }
    } catch (error) {
      console.error('Lỗi khi lưu nhóm ngẫu nhiên:', error);
    }
  };

  return (
    <div>
      <h2>Random Group</h2>
      <div>
        <label htmlFor="groupSize">Nhập số lượng thành viên cho nhóm:</label>
        <input
          type="number"
          id="groupSize"
          value={groupSize}
          onChange={(e) => setGroupSize(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="groupName">Nhập tên nhóm:</label>
        <input
          type="text"
          id="groupName"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
      </div>
      <button onClick={generateRandomGroup}>Tạo Nhóm Ngẫu Nhiên</button>
      {groupSize && <p>Số lượng thành viên trong nhóm sẽ được tạo: {groupSize}</p>}
      {randomGroup && (
        <div>
          <h3>Nhóm Ngẫu Nhiên:</h3>
          <p>Tên Nhóm: {randomGroup.groupName}</p>
          <p>Thành Viên:</p>
          <ul>
            {randomGroup.members.map((memberId, index) => {
              const student = students.find(student => student.student_id === memberId); // Sử dụng student_id thay vì id
              if (student) {
                return (
                  <li key={index}>
                    <div>
                      <strong>student id:</strong> {student.studentId}
                    </div>
                    <div>
                      <strong>class id:</strong> {student.classId}
                    </div>
                  </li>
                );
              } else {
                return <li key={index}>Sinh viên không tồn tại</li>;
              }
            })}
          </ul>
          <button onClick={saveRandomGroup}>Lưu Nhóm Ngẫu Nhiên</button>
        </div>
      )}
      {error && <div className="error">{error}</div>}
      {successMessage && <div className="success">{successMessage}</div>}
    </div>
  );
};

export default ClassDetailPage;