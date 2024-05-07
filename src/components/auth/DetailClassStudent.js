import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios';
import add from './img/add.png';
const DetailClassStudent = () => {
    const [classDetail, setClassDetail] = useState(null);
  const { classId } = useParams(); // Lấy classId từ URL
  const [isClassworkopen, setIsClasswork] = useState(false);
  const [isCreateClassworkopen, setIsCreateClasswork] = useState(false);
  const [isStream, setIsStream] = useState(true); // Mặc định mở Stream
  const [isPeople, setIspeople] = useState(false);
  const [isGroup, setIsGroup] = useState(false);
  const [isCreateGroup, setIsCreateGroup] = useState(false);
  const [isProject, setIsProject] = useState(false);
  const [isCreateProject, setIsCreateProject] = useState(false);
  const [isProjectGroup, setIsProjectGroup] = useState(false)
  const [isAdd, setIsAdd] = useState(false);
  const createClassRef = useRef();
  const [accountId, setAccount] = useState([]);
  // add report request
  /*add project */
  const [subjectClass, setsubjectClass] = useState('');
  const [requestOfProject, setrequestOfProject] = useState('');
  const [expiredTime, setexpiredTime] = useState('');
  const [expiredDate, setexpiredDate] = useState('');
  const [expiredAction, setexpiredAction] = useState('');
  const [requestTile, setrequestTile] = useState('');
  const [requestDescription, setrequestDescription] = useState('');
  const handleAddReportRequest = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:8080/api/report-request`,
        {
          subjectClass: subjectClass,
          requestOfProject: requestOfProject,
          expiredTime: expiredTime,
          expiredDate: expiredDate,
          expiredAction: expiredAction,
          requestTile: requestTile,
          requestDescription: requestDescription
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token // Thêm token vào header
          }
        }
      );
      if (response.status !== 200) {
        setsubjectClass('');
        setrequestOfProject('');
        setexpiredTime('');
        setexpiredDate('');
        setexpiredAction('');
        setrequestTile('');
        setrequestDescription('');
        window.alert("Report created successfully !");
      }
    } catch (error) {
      window.alert("Add fail !");
    }
  };
  //lấy danh sách report of class id
  const [reportList, setreportList] = useState([]);
  useEffect(() => {
    // Fetch the list of report request
    fetch(`http://localhost:8080/api/report-request/${classId}`)
      .then(response => response.json())
      .then(data => {
        setreportList(data);
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch(error => console.error('Error fetching report list:', error));
  }, [classId]);
  /* upload file on list student */
  const fileInputRef = useRef(null);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [classList, setClassList] = useState([]);
  const handleFileUpload = async () => {
    const file = fileInputRef.current.files[0];
    if (file && selectedClassId) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        await axios.post(`http://localhost:8080/api/account/class/${selectedClassId}/excel`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        window.alert('File uploaded successfully!');
        // Load lại trang sau khi thêm thành công
        window.location.reload(false);
      } catch (error) {
        window.alert('File uploaded fail!');
      }
    } else {
      console.error('No file selected or class not selected');
      window.alert('No file selected or class not selected!');
    }
  };

  // lay userId by account 
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const userId = localStorage.getItem('userId'); // Lấy userId từ localStorage
        if (!userId) {
          console.error('userId not found in localStorage');
          return;
        }
        const response = await fetch(`http://localhost:8080/api/class/createdBy/${userId}`);
        const classData = await response.json();
        setClassList(classData);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    fetchClasses();
  }, []);
  // /*show list student of class*/
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Fetch the list of students
    fetch(`http://localhost:8080/api/class/${classId}/student-list`)
      .then(response => response.json())
      .then(data => {
        setStudentList(data);
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch(error => console.error('Error fetching student list:', error));
  }, [classId]);
  const handleDeleteSV = async (id) => {
    const confirmed = window.confirm("Bạn có chắc muốn xóa sinh viên này không?");
    if (!confirmed) {
      // Không xóa nếu người dùng không xác nhận
      return;
    }
    try {
      const url = `http://localhost:8080/api/class/student-list/${classId}/${id}`;
      const responseDelete = await fetch(url, {
        method: 'DELETE'
      });

      if (responseDelete.ok) {
        // Xóa sinh viên khỏi danh sách nếu xóa thành công
        setStudentList(studentList.filter(student => student.studentId !== id));
        alert("Xóa sinh viên thành công!");
        // Load lại trang sau khi xóa thành công
        window.location.reload(true);
      } else {
        console.error('Failed to delete student');
        alert("Xóa sinh viên không thành công!");
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      alert("Đã xảy ra lỗi khi xóa sinh viên!");
    }
  };
  /*show list group of class */
  const [grouptList, setGroupList] = useState([]);
  useEffect(() => {
    // Fetch the list of students
    fetch(`http://localhost:8080/api/class/${classId}/group-list`)
      .then(response => response.json())
      .then(data => {
        setGroupList(data);
      })
      .catch(error => console.error('Error fetching student list:', error));
  }, [classId]);
  // Hiển thị danh sách dự án của một nhóm khi nhấp vào tên nhóm
  const toggleProjectOfGroup = async (groupId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/group/${groupId}/projects`);
      if (!response.ok) {
        throw new Error('Failed to fetch projects for this group');
      }
      const classDetailData = await response.json();
      // In classDetailData ra console để kiểm tra dữ liệu nhận được
      console.log(classDetailData);
      console.log("chai che" + groupId);
      // Bạn có thể sử dụng classDetailData để hiển thị danh sách dự án của nhóm
    } catch (error) {
      console.error('Error fetching projects for group:', error);
    }
  };
  /*add project */
  const [project_name, setProjectName] = useState('');
  const [project_of_group, setProjectOfGroup] = useState('');
  const [description, setDescription] = useState('');
  const [expired_day, setExpiredDay] = useState('');
  const [expired_time, setExpiredTime] = useState('');
  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:8080/api/project/create-project`,
        {
          projectName: project_name,
          projectOfGroup: project_of_group,
          projectDescription: description,
          expiredDay: expired_day,
          // expiredTime: formatTime(expired_time)
          expiredTime: expired_time
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token // Thêm token vào header
          }
        }
      );
      if (response.status === 200) {
        // Đặt lại các trường nhập
        setProjectName('');
        setProjectOfGroup('');
        setDescription('');
        setExpiredDay('');
        setExpiredTime('');
        window.alert("Project created successfully !");
      }
    } catch (error) {
      window.alert("Add fail !");
    }
  };
  /*Add group*/
  const [groupName, setgroupName] = useState('');
  const [class_id, setClassId] = useState('');
  const [group_name, setGroupName] = useState('');
  const [leader_id, setLeaderid] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [groupId, setGroupId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Kiểm tra xem các trường đã được nhập đầy đủ chưa
    if (!leader_id || !class_id || !group_name) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    try {
      const response = await axios.post(`http://localhost:8080/api/class/create-a-group`, {
        leaderId: leader_id,
        classId: class_id,
        groupName: group_name,
      });
      // Kiểm tra xem yêu cầu đã thành công hay không
      if (response.status !== 200) {
        // Đặt lại các trường nhập
        setLeaderid('');
        setClassId('');
        setGroupName('');
        // Đặt thông báo thành công
        window.alert("Add group success")
        window.location.reload(false)
      } else {
        // Xử lý thông báo lỗi nếu có
        setError('Có lỗi xảy ra khi tạo nhóm. Vui lòng thử lại sau.');
      }
    } catch (error) {
      // Xử lý thông báo lỗi trả về từ máy chủ
      setError('Có lỗi xảy ra khi tạo nhóm. Vui lòng thử lại sau.');
    }
  };
  // delete group of class
  const handleDeleteGroup = async (id) => {
    const confirmed = window.confirm("Bạn có chắc muốn xóa nhóm này không?");
    if (!confirmed) {
      return;
    }
    try {
      const url = `http://localhost:8080/api/group/${id}`;
      const responseDelete = await fetch(url, {
        method: 'DELETE'
      });

      if (responseDelete.ok) {
        window.alert("Xóa nhóm thành công!");
        window.location.reload(true);
      } else {
        console.error('Failed to delete group');
        alert("Đã xảy ra lỗi khi xóa nhóm!");
      }
    } catch (error) {
      console.error('Error deleting group:', error);
      alert("Đã xảy ra lỗi khi xóa nhóm!");
    }
  };
  /*click hide of element*/
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (createClassRef.current && !createClassRef.current.contains(event.target)) {
        setIsCreateProject(false);
        setIsCreateGroup(false);
        setIsCreateClasswork(false);
        setIsAdd(false);
        setIsProjectGroup(false)
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  /*show detail of class */
  useEffect(() => {
    const fetchClassDetail = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/class/${classId}`);
        const classDetailData = await response.json();
        setClassDetail(classDetailData);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchClassDetail();
  }, [classId]);
  if (!classDetail) {
    return <p>Loading...</p>;
  }
  const toggleCreateClasswork = () => {
    setIsCreateClasswork(!isCreateClassworkopen)
    setIsClasswork(false);
    setIsStream(false);
    setIspeople(false);
    setIsGroup(false);
    setIsProject(false);

  };
  const toggleStream = () => {
    setIsStream(!isStream);
    setIsClasswork(false);
    setIspeople(false);
    setIsGroup(false);
    setIsProject(false);
  };

  const togglePeople = () => {
    setIspeople(!isPeople);
    setIsClasswork(false);
    setIsStream(false);
    setIsGroup(false);
    setIsProject(false);
  };

  const toggleGroup = () => {
    setIsGroup(!isGroup);
    setIsClasswork(false);
    setIsStream(false);
    setIspeople(false);
    setIsProject(false);
  };
  const toggleCreateGroup = () => {
    setIsCreateGroup(!isCreateGroup);
    setIsGroup(false);
    setIsClasswork(false);
    setIsStream(false);
    setIspeople(false);
    setIsProject(false);
  };
  const toggleCreateProject = () => {
    setIsCreateProject(!isCreateProject);
    setIsProject(false);
    setIsGroup(false);
    setIsClasswork(false);
    setIsStream(false);
    setIspeople(false);
  };
  const toggleAddmember = () => {
    setIsAdd(!isAdd);
    setIsCreateProject(false);
    setIsProject(false);
    setIsGroup(false);
    setIsClasswork(false);
    setIsStream(false);
    setIspeople(false);
  };
  const toggleProjectOfGroup1 = () => {
    setIsProjectGroup(!isProjectGroup);
    setIsAdd(false);
    setIsCreateProject(false);
    setIsProject(false);
    setIsGroup(false);
    setIsClasswork(false);
    setIsStream(false);
    setIspeople(false);
  };

  const handleCheckboxChange = (studentId) => {
    // Clone the selectedStudents array
    let updatedSelectedStudents = [...accountId];

    // If the studentId is already in the selectedStudents array, remove it. Otherwise, add it.
    if (updatedSelectedStudents.includes(studentId)) {
      updatedSelectedStudents = updatedSelectedStudents.filter(id => id !== studentId);
    } else {
      updatedSelectedStudents.push(studentId);
    }

    // Update the state
    setAccount(updatedSelectedStudents);
  };

  const handleSave = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/class/add-member', {
        classId: classId,
        groupName: groupName,
        accountId: accountId
      });
      const { token } = response.data;
      localStorage.setItem('token', token);
      console.log('Data saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  // show project âll grouid 

  return (
    <div>
      <Navbar />
      <div className='container-main'>
        <div className='container-header'>
          <div className={`header-1 ${isStream ? 'open' : ''}`} onClick={toggleStream}>Stream</div>
          <div className={`header-1 ${isPeople ? 'open' : ''}`} onClick={togglePeople}>People</div>
          <div className={`header-1 ${isGroup ? 'open' : ''}`} onClick={toggleGroup}>Group</div>
          <div className={`header-1 ${isGroup ? 'open' : ''}`} onClick={toggleAddmember}>Add Member Group</div>
        </div>
        {isStream && (
          <div className='container-body'>
            <div className='body-1'>
              <p>{classDetail.subjectName}</p>
            </div>
            <div className='body-2'>
              <div className='works'>
                <ul>
                  {reportList.map((report) => (
                    <li key={report.requestId}>
                      <span>{report.requestTile}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        {isPeople && (
          <div className='container-body'>
            <div className='works'>
              <p className='dsshow'>List Students</p>
              <ul>
                {studentList.map((student) => (
                  <li key={student.classId}>
                    <span>{student.classId}-{student.studentId}-{student.studentClass}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {isGroup && (
          <div className='container-body'>
            <div className='create-work' onClick={toggleCreateGroup}>
              <img src={add} alt='Create' />
              <p>Add group</p>
            </div>
            <div className='works'>
              <p className='dsshow'>List Group</p>
              {grouptList.map((group) => (
                <li key={group.groupId} onClick={() => toggleProjectOfGroup(group.groupId)}>
                  <span onClick={toggleProjectOfGroup1}>{group.groupName}</span>
                </li>
              ))}
            </div>
          </div>
        )}
        {isProjectGroup && (
          <div>
            <div className='class-list-teach'>
              {classList.map((classItem) => (
                <li key={classItem.id} className='showclass-1'>
                  <div>
                    <div className='name_class'><Link to={`/class/${classItem.projectId}`}>{classItem.projectName}</Link></div>
                  </div>
                </li>
              ))}
            </div>
          </div>
        )}
        {isCreateGroup && (
          <div ref={createClassRef} className='container-create-project'>

            <form onSubmit={handleSubmit}>
              <input
                type='text'
                placeholder='leader ID'
                className='input'
                value={leader_id}
                onChange={(e) => setLeaderid(e.target.value)}
              />
              <input
                type='text'
                placeholder='Class ID'
                className='input'
                value={class_id}
                onChange={(e) => setClassId(e.target.value)}
              />
              <input
                type='text'
                placeholder='Group Name'
                className='input'
                value={group_name}
                onChange={(e) => setGroupName(e.target.value)}
              />
              <button className='btn btn-primary' type='submit'>
                Create
              </button>
            </form>
          </div>
        )}
        {isProject && (
          <div className='container-body' >
            <div className='create-work' onClick={toggleCreateProject}>
              <img src={add} alt='Create' />
              <p>Add Project</p>
            </div>
            <div className='works'>
              show all Project here
            </div>
          </div>
        )}
        {isCreateProject && (
          <div ref={createClassRef} className='container-create-project'>
            <form onSubmit={handleAddProject}>
              <input
                type='text'
                placeholder='Project Name'
                className='input'
                value={project_name}
                onChange={(e) => setProjectName(e.target.value)}
              />
              <select onChange={(e) => setProjectOfGroup(e.target.value)} value={project_of_group}>
                <option value=''>Select Group</option>
                {grouptList.map((group) => (
                  <option key={group.group_id} value={group.group_id}>
                    {group.groupId}
                  </option>
                ))}
              </select>
              <input
                type='text'
                placeholder='Description'
                className='input'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <input
                type='date'
                placeholder='CreateDay'
                className='input'
                value={expired_day}
                onChange={(e) => setExpiredDay(e.target.value)}
              />
              <input
                type='text'
                placeholder='CreateTime'
                className='input'
                value={expired_time}
                onChange={(e) => setExpiredTime(e.target.value)}
              />
              {error && <div className="error">{error}</div>}
              {successMessage && <div className="success">{successMessage}</div>}
              <button className='btn btn-primary' type='submit' onClick={handleAddProject}>
                Add project
              </button>
            </form>
          </div>
        )}
        {isAdd && (
          <div className='container-body'>
            <div className='works'>
              <p className='dsshow'>List Students</p>
              <select onChange={(e) => setgroupName(e.target.value)} value={groupName}>
                <option value=''>Select Group</option>
                {grouptList.map((group) => (
                  <option key={group.group_id} value={group.group_id}>
                    {group.groupName}
                  </option>
                ))}
              </select>
              <select onChange={(e) => setClassId(e.target.value)} value={classId}>
                <option value=''>Select Class</option>
                {classList.map((classItem) => (
                  <option key={classItem.subjectClassId} value={classItem.subjectClassId}>{classItem.subjectName}</option>
                ))}
              </select>
              <button onClick={handleSave}>Save</button>
              <ul>
                {studentList.map((student) => (
                  <li key={student.classId}>
                    <span>{student.classId}-{student.studentId}-{student.studentClass}</span>
                    <input
                      type='checkbox'
                      onClick={() => handleCheckboxChange(student.accountId)}
                      checked={accountId.includes(student.accountId)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default DetailClassStudent