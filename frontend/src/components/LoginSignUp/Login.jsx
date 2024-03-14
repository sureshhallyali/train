import React,{ useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../../css/commonStyle.css'
const Login = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState();
  const [password, setPassword] = useState('');

  const handleLogin = async(e) => {
    e.preventDefault();
    if (!phone || !password) {
      alert('Please fill in all fields.');
      return;
    }

    try{
      const response = await fetch("http://localhost:3000/user/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          password
        }),
      })
    
      const res = await response.json();
      if(response.status === 201)
      {
        alert(res.message);
       navigate("/home");
      }
      else if(response.status === 404)
      {
        alert(res.message);
      }
      else if(response.status === 401)
      {
        alert(res.message);
      }
      
    }catch(error)
    {
      console.log(error)
    }
    
  };

  return (
    <div className='header'>
      <div className="container">
        <h1>Login</h1>
        <form>
          <input 
            type="phone" 
            placeholder='phone Address'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input 
            type="password" 
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </form>
        <button onClick={handleLogin}>Login</button>
        <div className='member'>
          Don't have an account? <Link to='/signup'>Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
