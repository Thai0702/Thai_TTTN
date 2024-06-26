import React, { useState } from 'react';
import './main.css';
import Navbar from './Navbar';
import { BE_URL } from '../../utils/Url_request';
import { useNavigate } from 'react-router-dom';

const Join = () => {
  const [classData, setClassData] = useState({
    inviteCode: '',
  });
  const [classList, setClassList] = useState([]);
  const navigate = useNavigate();

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClassData({
      ...classData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleJoin = async () => {
    if (!classData.inviteCode) {
      window.alert('Vui lòng điền mã lớp.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BE_URL}/api/join-class/form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({ inviteCode: classData.inviteCode }),
      });
      if(response.ok){
        window.alert('Join class success!');
        navigate('/');
      }
      else{
        window.alert('User already in class!');
      }
    
        // if(response.status!==200){
        //   console.log(" xin chao ban");
         
        //   // const data = await response.json();
        //   // console.log(data);
        //   // setClassList([...classList, data]);         
        // }
        // window.location.reload(false);      
    } catch (error) {
      console.error('Error:', error);
      window.alert('Failed to join class. Please try again.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className='container-join'>
        <p>Enter code class to Join!</p>
        <input
          type='text'
          placeholder='Code class'
          className='input'
          name='inviteCode'
          value={classData.inviteCode}
          onChange={handleInputChange}
        />
        <button className='button-join' onClick={handleJoin}>
          Join
        </button>
      </div>
    </div>
  );
};

export default Join;
