using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace QuanLyCongDanThanhPho
{
    public class CongDanDAO
    {
        DBConnection exec = new DBConnection();

        public CongDan KiemTraDangNhap(string tentk, string matkhau)
        {
            string query = string.Format("SELECT * FROM dbo.CongDan WHERE TenTK = N'{0}' AND MatKhau = N'{1}'", tentk, matkhau);
            DataTable result = exec.LayDanhSach(query);

            foreach (DataRow dr in result.Rows)
            {
                return new CongDan(dr);
            }
            return null;
        }

        public DataTable LayDanhSach()
        {
            string sqlStr = string.Format("SELECT * FROM dbo.CongDan");
            return exec.LayDanhSach(sqlStr);
        }

        public void Them(CongDan cd)
        {
            string sqlStr = string.Format($"INSERT INTO dbo.CongDan(HoTen, NgaySinh, NoiSinh, GioiTinh, NgheNghiep, DanToc, TonGiao, TinhTrang, HonNhan, TenTK, MatKhau, LoaiTK, SoDu) VALUES(N'{cd.HoTen}', N'{cd.NgaySinh.ToString("yyyy-MM-dd")}', N'{cd.NoiSinh}', {cd.GioiTinh}, N'{cd.NgheNghiep}', N'{cd.DanToc}', N'{cd.TonGiao}', {cd.TinhTrang}, {cd.HonNhan}, N'{cd.TenTK}', N'{cd.MatKhau}', {cd.LoaiTK}, {cd.SoDu})");
            exec.Execute(sqlStr);
            CongDan nCD = LayThongTinCongDanBangTenTK(cd.TenTK);
            cd.MaCD = nCD.MaCD;
            if (cd.Hinh != null)
                LuuAnh(cd, cd.Hinh);
        }

        public void Xoa(CongDan cd)
        {
            string sqlStr = string.Format("DELETE FROM dbo.CongDan WHERE MaCD = {0}", cd.MaCD);
            exec.Execute(sqlStr);
        }

        public void Sua(CongDan cd)
        {
            string sqlStr = $"UPDATE dbo.CongDan SET HoTen = N'{cd.HoTen}', NgaySinh = N'{cd.NgaySinh.ToString("yyyy-MM-dd")}', NoiSinh = N'{cd.NoiSinh}', GioiTinh = {cd.GioiTinh}, NgheNghiep = N'{cd.NgheNghiep}', DanToc = N'{cd.DanToc}', TonGiao = N'{cd.TonGiao}', HonNhan = {cd.HonNhan}, TinhTrang = {cd.TinhTrang}, MatKhau = N'{cd.MatKhau}', TenTK = N'{cd.TenTK}', LoaiTK = {cd.LoaiTK}, SoDu = {cd.SoDu} WHERE MaCD = {cd.MaCD}";
            exec.Execute(sqlStr);
            if (cd.Hinh != null)
                LuuAnh(cd, cd.Hinh);
        }

        public CongDan LayThongTinCongDanBangTenTK(string tentk)
        {
            string query = string.Format("SELECT * FROM dbo.CongDan WHERE TenTK = N'{0}'", tentk);
            DataTable result = exec.LayDanhSach(query);

            foreach (DataRow dr in result.Rows)
                return new CongDan(dr);
            return null;
        }

        public void LuuAnh(CongDan cd, byte[] anh)
        {
            cd.Hinh = anh;
            using (SqlConnection conn = new SqlConnection(Properties.Settings.Default.cnnStr))
            {
                conn.Open();
                using (SqlCommand command = new SqlCommand("UPDATE dbo.CongDan SET Hinh = @anh WHERE MaCD = @id ", conn))
                {
                    command.Parameters.AddWithValue("@id", cd.MaCD);
                    command.Parameters.AddWithValue("@anh", anh);
                    command.ExecuteNonQuery();
                }
                conn.Close();
            }
        }

        public DataTable TimKiem(string find)
        {
            string sqlStr = string.Format($"SELECT * FROM dbo.fTimKiemCongDan(N'{find}')");
            return exec.LayDanhSach(sqlStr);
        }

        public CongDan LayThongTinCongDanBangMaCD(int macd)
        {
            string sqlstr = string.Format("SELECT * FROM dbo.CongDan WHERE MaCD = {0}", macd);
            DataTable dt = exec.LayDanhSach(sqlstr);

            foreach (DataRow dr in dt.Rows)
                return new CongDan(dr);
            return null;
        }

        public byte[] ChuyenAnhThanhMangByte(PictureBox pt)
        {
            MemoryStream ms = new MemoryStream();
            pt.Image.Save(ms, pt.Image.RawFormat);
            return ms.ToArray();
        }

        public AutoCompleteStringCollection tinhThanh = new AutoCompleteStringCollection()
        {
            "Hà Nội", "TP Hồ Chí Minh", "Đà Nẵng", "Hải Phòng",
            "Bắc Giang", "Bắc Kạn", "Bạc Liêu", "Bắc Ninh",
            "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước",
            "Bình Thuận", "Cà Mau", "Cần Thơ", "Cao Bằng",
            "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai",
            "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam",
            "Hà Tĩnh", "Hải Dương", "Hậu Giang", "Hòa Bình",
            "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum",
            "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai",
            "Long An", "Nam Định", "Nghệ An", "Ninh Bình",
            "Ninh Thuận", "Phú Thọ", "Quảng Bình", "Quảng Nam",
            "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng",
            "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên",
            "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "Trà Vinh",
            "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái",
        };

        public AutoCompleteStringCollection danToc = new AutoCompleteStringCollection()
        {
            "Kinh", "Tày", "Thái", "Mường", "Nùng", "Hoa", "Khmer", "Dao",
            "Bana", "Êđê", "Sán Chay", "Chăm", "Sán Dìu", "Co", "La Hủ",
            "La Chí", "La Ha", "Pu Péo", "Rơ Măm", "Ba Na", "Brâu", "Cơ Tu",
            "Giáy", "Hà Nhì", "Mảng", "Pa Then", "Phù Lá", "Si La", "Xa Phó",
            "Thổ", "Chu Ru", "Lào", "La", "Lự", "Mạ", "Mảng", "Pa Then",
            "Pà Thẻn", "Pù Chả", "Rơ Ngao", "Tà Ôi", "Tày Trắng",
            "Thái Đen", "Thái Đỏ", "Thái Trắng", "Thổ", "Xinh Mun",
            "Xơ Đăng", "Bru-Vân Kiều", "Chứt", "Cơ Lao", "Cống", "Hrê",
            "Khơ Mú", "La Hu", "Mạ", "Mnông", "ơ Đu", "Pạ Lông", "Phù Lá",
            "Rơ Măm", "Rơ Ngao", "Sedang", "Tà Lăng", "Tà Ôi", "Xơ Mông",
        };
    }
}
