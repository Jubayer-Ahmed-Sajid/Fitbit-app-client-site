import { useEffect, useState } from 'react';
import axiosInstance from './api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function App() {
  const navigate = useNavigate()
  const [exchangeCode, setExchangeCode] = useState('')



  const handleAuthorize = async () => {
    try {
      const response = await axiosInstance.get('/authorize');

      if (response.status === 200) {
        const authurl = response.data.auth
        console.log(authurl)
        navigate(`//${authurl}`)
        console.log('Redirecting to Fitbit for authorization');
      } else {
        console.error('Authorization failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {

      console.log('Received authorization code:', code);
      setExchangeCode(code)

    }
  }, []);



  const handleAccessToken = async () => {
    console.log(exchangeCode)
    const response = await axios.post('http://localhost:5000/callback', { exchangeCode: exchangeCode });

    console.log(response.data.accessToken)
    localStorage.setItem('Authorization', `${response.data.accessToken}` )

  }


  return (
    <div className="App">
      <h1>Fitbit Integration Example</h1>
      <button onClick={handleAuthorize}>Authorize with Fitbit</button>

      <div>
        <h1>Get access Token</h1>
        <button onClick={handleAccessToken}>Get Data</button>
      </div>
    </div>
  );
}

export default App;
