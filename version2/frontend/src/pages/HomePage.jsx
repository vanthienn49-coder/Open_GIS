import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/map?search=${encodeURIComponent(searchKeyword.trim())}`);
    } else {
      navigate('/map');
    }
  };

  const handleChipClick = (category) => {
    navigate(`/map?category=${encodeURIComponent(category)}`);
  };

  return (
    <>
      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-bg">
            <div
              className="hero-bg-img"
              style={{
                backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDC8BnpIvo7CYldXlvLW2-Tvanh2k84ibDqHREaY7NAj6VTNOxpPfBz-yvWpwxVObItumF4aw5mQq8nYv6tf3n0jteKeJGrvBPbJ8qWIAyvWcB4I-Mlv0HBo1iVrSq06-GNaMkWxF3ObgutOgKEe_PbuHE8ic7vOqAVKM5W9eeaAxqC3d3okX4bv_WIr-18ZH94uUa6QOV_-Q3OywDgOHIbJ3WPfPp83lx9EMY4psH1no5ZkXTQugI8PIYqbv6EIviyNkU7Un-fznlh")`
              }}
            />
            <div className="hero-overlay" />
          </div>

          <div className="hero-content animate-fade-in-up">
            <h1>
              Khám phá vẻ đẹp <span className="text-primary">Quy Nhơn</span>
              <br /> qua bản đồ số
            </h1>
            <p className="hero-subtitle">
              Hệ thống thông tin địa lý tích hợp, hỗ trợ quản lý đô thị minh bạch và quy hoạch phát triển bền vững.
            </p>

            <form className="hero-search" onSubmit={handleSearch}>
              <div className="search-icon">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                type="text"
                placeholder="Tìm địa điểm du lịch, bãi biển, hoặc khách sạn..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              <button type="submit" className="search-btn">
                Tìm kiếm
              </button>
            </form>

            <div className="hero-chips">
              <span className="chip" onClick={() => handleChipClick('Biển')}>
                # Bãi biển
              </span>
              <span className="chip" onClick={() => handleChipClick('Du lịch')}>
                # Du lịch
              </span>
              <span className="chip" onClick={() => handleChipClick('Di tích')}>
                # Di tích
              </span>
            </div>
          </div>

          <div className="hero-scroll">
            <span className="material-symbols-outlined">expand_more</span>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <div className="quick-actions-grid">
            <Link to="/map" className="action-card" style={{ textDecoration: 'none' }}>
              <div className="action-card-icon primary">
                <span className="material-symbols-outlined">public</span>
              </div>
              <h4>Xem ranh giới thành phố</h4>
            </Link>

            <Link to="/map?category=Du lịch" className="action-card" style={{ textDecoration: 'none' }}>
              <div className="action-card-icon secondary">
                <span className="material-symbols-outlined">tour</span>
              </div>
              <h4>Tìm điểm du lịch</h4>
            </Link>

            <Link to="/map" className="action-card" style={{ textDecoration: 'none' }}>
              <div className="action-card-icon tertiary">
                <span className="material-symbols-outlined">directions_car</span>
              </div>
              <h4>Chỉ đường thông minh</h4>
            </Link>
          </div>
        </section>

        {/* Featured Destinations */}
        <section className="featured-section">
          <div className="section-header">
            <h2>Điểm đến nổi bật</h2>
            <div className="section-bar" />
          </div>

          <div className="destinations-grid">
            <div className="destination-card" onClick={() => navigate('/map?search=Kỳ Co')}>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPKt_UdkyGCpNXGgWrZ1Kt1pL47VpcWGBLHucsYPGfZ3GHTEfxeGjAsD0klp2FmNwmiGGhDNtTHypX6_Q5ycBObs93A2eHu7pOVh7B5jOCjOvxk8dJef2RM3fOiwaKwEUISraGZ2UryJfyU5UkQa76Glb2_0W2Bx7xdCDadrPHMkjBkEROgUoWjNbwtlRrchOBLveEr5u__BC98us9BWtHWoGvk2Z8UKvKJjIuyNn2GfO9olGjaVMSaNTm_VLS_E7nkgNMQXOJpuAO"
                alt="Bãi tắm Kỳ Co"
              />
              <div className="destination-card-overlay">
                <h3>Bãi tắm Kỳ Co</h3>
                <p>Được mệnh danh là Maldives của Việt Nam với làn nước trong xanh và bãi cát trắng mịn.</p>
              </div>
            </div>

            <div className="destination-card" onClick={() => navigate('/map?search=Eo Gió')}>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAamTHJ3EUqZOzYquzthY4PZ1w7BJatTAEZK3eSCQvWk9oYrNtIfPriyOYEQJqf2NKd5CEnxOOPoELPvkLNqxT83KIWbtOcaLMcG8AFG4GbUXLM1C6TawHYE_5TwfxnfBVuiKzpwZkENr84M7I8ui1wguzUf3NG1jDeYmdmeS1cqZlE0FdCwBAXRORO9l22wqW3DFec0n5ptJcybY4KE6VxadP9W5YKCnUuSXIa7c__VFw2Qs7SJxoXzQdkJkHbNRNus9g010fm191_"
                alt="Eo Gió"
              />
              <div className="destination-card-overlay">
                <h3>Eo Gió</h3>
                <p>Cung đường đi bộ ven biển tuyệt đẹp với những rặng đá hoang sơ hùng vĩ.</p>
              </div>
            </div>

            <div className="destination-card" onClick={() => navigate('/map?search=Tháp Đôi')}>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXNqlWWcW-xZvXqSfjBqOwaP9cOHyqJVRyeeq-f3Xgwx7ib59Ngsx-ey7Fc27NDue98zskcu8V1eqC7_LDKBf001hc1tBVhbRW0M1ZogynZd8P0igMJ-nDqd1mDA057qrmmjrxrcBNPuWorsUSYam-RgJ2Hj7rAtPLwjUsOo5DeBXMHdMrFVD0hvTtagasiHWzLKmBzDyUWx17wFT95UcZwd3yUAqKUMXdnzNM-lROdyFpjC5JCOPxDzHqkkEDZaKsgPs7Ta03BkoS"
                alt="Tháp Đôi"
              />
              <div className="destination-card-overlay">
                <h3>Tháp Đôi</h3>
                <p>Di tích kiến trúc văn hóa Chăm độc đáo nằm ngay trong lòng thành phố.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-box">
            <div className="cta-blob-1" />
            <div className="cta-blob-2" />
            <div className="cta-content">
              <h2>Khám phá Quy Nhơn ngay hôm nay</h2>
              <p>
                Bắt đầu hành trình tìm hiểu không gian sống và cơ hội đầu tư tại thành phố biển xinh đẹp thông qua hệ thống bản đồ số tiên tiến nhất.
              </p>
              <Link to="/map">
                <button className="btn-white-pill">
                  Mở bản đồ tương tác
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-brand-name">Quy Nhon WebGIS</div>
            <p>
              Hệ thống thông tin địa lý thành phố Quy Nhơn được vận hành bởi Sở Xây dựng Bình Định nhằm phục vụ nhu cầu quản lý và khai thác thông tin không gian của tổ chức và cá nhân.
            </p>
            <div className="footer-social">
              <a href="#"><span className="material-symbols-outlined" style={{ fontSize: '18px' }}>group</span></a>
              <a href="#"><span className="material-symbols-outlined" style={{ fontSize: '18px' }}>mail</span></a>
              <a href="#"><span className="material-symbols-outlined" style={{ fontSize: '18px' }}>language</span></a>
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-links-col">
              <h5>Điều hướng</h5>
              <ul>
                <li><Link to="/map">Bản đồ tương tác</Link></li>
                <li><a href="#">Tra cứu quy hoạch</a></li>
                <li><a href="#">Dữ liệu mở</a></li>
              </ul>
            </div>
            <div className="footer-links-col">
              <h5>Hỗ trợ</h5>
              <ul>
                <li><a href="#">Trung tâm trợ giúp</a></li>
                <li><a href="#">Phản hồi kỹ thuật</a></li>
                <li><a href="#">API Developer</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2024 Quy Nhon City People's Committee — Department of Construction</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Support</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default HomePage;
