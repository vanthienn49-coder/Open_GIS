import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './pages/Home'; // Trỏ đúng đến file Home.jsx bạn đã sửa
import 'bootstrap/dist/css/bootstrap.min.css'; // Đảm bảo đã import bootstrap
import './styles/map.css'; // Import file CSS bạn đã sửa

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>,
);