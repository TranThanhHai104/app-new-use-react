import React from 'react';

const Footer = () => {
    const isDark = document.body.classList.contains("dark-mode");

    return (
        <footer className="main-footer">
            <div className="footer-container">
                <div className="footer__service">
                    <div className="service-item">
                        <i className="fas fa-mobile-alt"></i>
                        <span>Tải ứng dụng </span>
                    </div>
                    <div className="service-item">
                        <i className="fas fa-envelope"></i>
                        <span>Đăng ký nhận bản tin hàng ngày</span>
                    </div>
                    <div className="service-item">
                        <i className="fas fa-headset"></i>
                        <span>Hỗ trợ kỹ thuật: 1900 1080</span>
                    </div>
                </div>

                <div className="footer__bottom">
                    <div className="footer-col">
                        <p><b>Cơ quan chủ quản:</b> Bộ Dân Tộc và Tôn Giáo</p>
                        <p><b>Số giấy phép:</b> 146/GP-BVHTTDL, cấp ngày 17/10/2025</p>
                        <p><b>Tổng biên tập:</b> Nguyễn Văn Bá</p>
                        <p>Địa chỉ: Tầng 18, Toà nhà Cục Viễn thông, 68 Dương Đình Nghệ, Hà Nội.</p>
                        <p>Điện thoại: 02439369898 - <b>Hotline: 0923457788</b></p>
                        <p>© 1997 - 2026 Báo VietNamNet. All rights reserved.</p>
                    </div>

                    <div className="footer-col">
                        <h4>Liên hệ</h4>
                        <p><b>Quảng cáo:</b> 0919405885 (Hà Nội)</p>
                        <p><b>Tòa soạn:</b> vietnamnet@vietnamnet.vn</p>
                        <p><b>Báo giá:</b> <a href="http://vads.vn" target="_blank" rel="noreferrer">vads.vn</a></p>
                        <div className="footer-links-row" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <a href="#">Tuyển dụng</a>
                            <a href="#">Gửi bài</a>
                            <a href="#">Bảo mật</a>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4>Theo dõi chúng tôi</h4>
                        <div className="social-icons">
                            <a href="#"><i className="fab fa-facebook"></i></a>
                            <a href="#"><i className="fab fa-youtube"></i></a>
                            <a href="#"><i className="fab fa-tiktok"></i></a>
                        </div>
                        <div className="theme-info" style={{ marginTop: '15px', fontSize: '12px', opacity: 0.7 }}>
                            <p>Phiên bản: 2.0.1</p>
                            <p>Chế độ: <span id="footer-theme-status">{isDark ? "Tối" : "Sáng"}</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;