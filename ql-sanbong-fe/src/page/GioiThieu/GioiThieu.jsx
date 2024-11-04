import React from 'react';
import Navbar from '../../component/Navbar/Navbar';
import Footer from '../../component/Footer/Footer';
import './GioiThieu.scss'; // Đường dẫn đến file CSS nếu cần

const GioiThieu = () => {
  return (
    <div className='gioi-thieu'> {/* Áp dụng class CSS nếu cần */}
        <Navbar />
        
        <h2>Chính sách bảo mật thông tin</h2>
        <p>
          Cám ơn quý khách đã quan tâm và truy cập vào website <strong>Sportplus.com</strong>. Chúng tôi tôn trọng và cam kết sẽ bảo mật những thông tin mang tính riêng tư của Quý khách.
        </p>
        <p>
          Chính sách bảo mật sẽ giải thích cách chúng tôi tiếp nhận, sử dụng và (trong trường hợp nào đó) tiết lộ thông tin cá nhân của Quý khách.
          Bảo vệ dữ liệu cá nhân và gây dựng được niềm tin cho quý khách là vấn đề rất quan trọng với chúng tôi. 
          Vì vậy, chúng tôi sẽ dùng tên và các thông tin khác liên quan đến quý khách tuân thủ theo nội dung của Chính sách bảo mật. 
          Chúng tôi chỉ thu thập những thông tin cần thiết liên quan đến giao dịch mua bán.
        </p>
        <p>
          Chúng tôi sẽ giữ thông tin của khách hàng trong thời gian luật pháp quy định hoặc cho mục đích nào đó. 
          Quý khách có thể truy cập vào website và trình duyệt mà không cần phải cung cấp chi tiết cá nhân. 
          Lúc đó, Quý khách đang ẩn danh và chúng tôi không thể biết bạn là ai nếu Quý khách không đăng nhập vào tài khoản của mình.
        </p>

        <h3>1. Mục đích và phạm vi thu thập</h3>
        <p>
          Cảm ơn Quý khách đã truy cập vào website của chúng tôi, để sử dụng dịch vụ tại website, Quý khách có thể được yêu cầu đăng ký thông tin cá nhân với chúng tôi như:
        </p>
        <ul>
          <li>- Họ và tên, địa chỉ liên lạc</li>
          <li>- Email, số điện thoại di động</li>
        </ul>
        <p>
          Chúng tôi cũng có thể thu thập thông tin về số lần viếng thăm website của chúng tôi bao gồm số trang Quý khách xem, số links Quý khách click và các thông tin khác liên quan đến việc kết nối đến địa chỉ chỉ kaiwinsport.com.
        </p>

        <h3>2. Phạm vi sử dụng thông tin</h3>
        <p>
          Kaiwinsport.com. thu thập và sử dụng thông tin cá nhân với mục đích phù hợp và hoàn toàn tuân thủ “chính sách bảo mật” này. 
          Chúng tôi chỉ sử dụng thông tin của Quý khách trong nội bộ công ty hoặc có thể công bố cho bên thứ 3 như các đại lý, các nhà cung cấp dịch vụ khác nhằm cung cấp dịch vụ tốt nhất, tối ưu nhất cho Quý khách.
        </p>
        <p>
          Khi cần thiết chúng tôi có thể sử dụng những thông tin này để liên hệ trực tiếp với Quý khách như gửi thư ngỏ, đơn đặt hàng, thư cảm ơn, thông tin về kỹ thuật và bảo mật, thông tin về khuyến mại, thông tin về sản phẩm dịch vụ mới…..
        </p>

        <h3>3. Thời gian lưu trữ thông tin</h3>
        <p>
          Các thông tin của Quý khách hàng sẽ được lưu trữ trong hệ thống nội bộ của công ty chúng tôi cho đến khi Quý khách có yêu cầu hủy bỏ các thông tin đã cung cấp.
        </p>

        <h3>4. Địa chỉ của đơn vị thụ thập và quản lý thông tin cá nhân</h3>
        <p>
          CÔNG TY CỔ PHẦN SPORT PLUS VIỆT NAM
        </p>
        <p>
          Địa chỉ: 31/2 Đ. Kênh 19/5, Phường Sơn Kỳ, Quận Tân Phú, Hồ Chí Minh
        </p>
        <p>
          Điện thoại: 0961.467.233
        </p>

        <h3>5. Phương tiện và công cụ để người dùng tiếp cận và chỉnh sửa dữ liệu cá nhân</h3>
        <p>
          Quý khách muốn chỉnh sửa thông tin cá nhân của mình vui lòng liên hệ tổng đài chăm sóc khách hàng của chúng tôi qua số điện thoại: 0961.467.233 hoặc qua địa chỉ email: kaiwinsport@gmail.com.
        </p>

        <h3>6. Cam kết bảo mật thông tin cá nhân khách hàng</h3>
        <p>
          Chúng tôi cam kết bảo mật thông tin của Quý khách hàng bằng mọi hình thức có thể theo chính sách bảo vệ thông tin cá nhân của chúng tôi.
        </p>
        <p>
          Chúng tôi tuyệt đối không chia sẻ thông tin của Quý khách cho bất cứ công ty hay bên thứ 3 nào khác ngoại trừ các đại lý và các nhà cung cấp liên quan đến việc cung cấp dịch vụ cho Quý khách hàng.
        </p>

        {/* Thêm phần Chính sách đổi trả sản phẩm */}
        <h2>Chính sách đổi trả sản phẩm</h2>
        <p>Kính gửi : Quý khách hàng</p>
        <p>
          Để đảm bảo quyền lợi của khách hàng khi sử dụng sản phẩm, dịch vụ của nhà Sport Plus, Sport Plus chấp nhận đổi hoặc trả sản phẩm và thỏa mãn điều kiện sau:
        </p>
        <ul>
          <li>Thời gian: Trong vòng 7 ngày kể từ ngày quý khách nhận được sản phẩm</li>
          <li>Sản phẩm bị các vấn đề:</li>
          <ul>
            <li>- Sản phẩm lỗi hỏng của nhà sản xuất: (Rách, bục chỉ, bẩn, bong tróc…)</li>
            <li>- Sản phẩm bị sai sót, nhầm lẫn trong quá trình đóng gói, vận chuyển: (Lệch, sai màu, kích cỡ, thiếu…)</li>
          </ul>
          <li>Theo yêu cầu của Quý khách muốn thay đổi cỡ, màu sắc, mẫu mã sản phẩm. Quý khách vui lòng thanh toán tiền vận chuyển 2 chiều: (gửi hàng cho Kaiwin và Kaiwin gửi lại cho Quý khách)</li>
          <li>Sản phẩm còn mới nguyên 100% và chưa qua sử dụng.</li>
          <li>Sport Plus hỗ trợ đổi tối đa 01 lần/khách hàng.</li>
        </ul>

        <h3>* Quy trình đổi trả hàng:</h3>
        <p>Bước 1: Quý khách cung cấp thông tin đơn hàng cho nhân viên kinh doanh hoặc liên hệ:</p>
        <p>Hotline 1: 0968687117</p>
        <p>Hotline 2: 0912098233</p>
        <p>Bước 2: Quý khách gửi sản phẩm muốn đổi hoặc trả qua đường bưu điện, đơn vị vận chuyển đến địa chỉ: Công ty Cổ Phần Sport Plus Việt Nam, Tầng 2 số 47 đường Đại Mỗ, phường Đại Mỗ, quận Nam Từ Liêm, Hà Nội</p>
        <p>Bước 3: Sau khi nhận được sản phẩm Sport Plus sẽ kiểm tra, phản hồi và gửi lại quý khách.</p>

        <h3>* Trường hợp giá trị sản phẩm đổi mới:</h3>
        <p>
          - Nếu nhỏ hơn giá trị sản phẩm mang đổi, Sport Plus sẽ chuyển lại tiền chênh lệch vào tài khoản Quý khách sau 3 ngày làm việc.
        </p>
        <p>
          - Nếu lớn hơn giá trị sản phẩm mang đổi, Quý khách vui lòng chuyển khoản số tiền chênh lệch vào tài khoản Sport Plus.
        </p>
        <p>
          - Trường hợp trả hàng: Sau khi nhận được, Sport Plus sẽ chuyển lại tiền chênh lệch vào tài khoản Quý khách sau 3 ngày làm việc.
        </p>

        <p>Mọi thắc mắc xin vui lòng liên hệ: 0968687117</p>

        <p>Chân thành cảm ơn Quý khách đã tin tưởng, sử dụng sản phẩm và dịch vụ của Sport Plus!</p>

        <Footer />
    </div>
  );
};

export default GioiThieu;
