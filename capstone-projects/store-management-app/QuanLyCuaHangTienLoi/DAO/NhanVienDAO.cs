using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace QuanLyCuaHangTienLoi
{
    internal class NhanVienDAO
    {
        DBConnection db = new DBConnection(Program.nv);

        public NhanVien KiemTraDangNhap(string tentk, string matkhau)
        {
            string query = string.Format("SELECT * FROM dbo.NhanVien WHERE TenTK = N'{0}' AND MatKhau = N'{1}'", tentk, matkhau);
            DataTable result = db.LayDanhSach(query);

            foreach (DataRow dr in result.Rows)
            {
                return new NhanVien(dr);
            }
            return null;
        }

        public DataTable LayDanhSach()
        {
            string sql = "Select * from NhanVien";
            return db.LayDanhSach(sql);
        }

        public DataTable LayDanhSach(int trangthai)
        {
            string sql = $"Select * from NhanVien where TrangThai = {trangthai}";
            return db.LayDanhSach(sql);
        }

        public void Them(NhanVien nv)
        {
            string query = String.Format($"EXEC dbo.sp_ThemNhanVien @tennv = N'{nv.TenNV}'," +
                                                                $"@sdt = N'{nv.Sdt}'," +
                                                                $"@phai = {nv.Phai}," +
                                                                $"@ngaysinh = N'{nv.NgaySinh.ToString("yyyy-MM-dd")}'," +
                                                                $"@email = N'{nv.Email}'," +
                                                                $"@macv = {nv.MaCV}," +
                                                                $"@trangthai = {nv.TrangThai}," +
                                                                $"@tentk = N'{nv.TenTK}'," +
                                                                $"@matkhau = N'{nv.MatKhau}'" );
            db.Execute(query);
            NhanVien nNV = LayThongTinNhanVienBangTenTK(nv.TenTK);
            nv.MaNV = nNV.MaNV;
            if (nv.Hinh != null)
            {
                LuuAnh(nv, nv.Hinh);
            }
        }

        public void Sua(NhanVien nv) 
        {
            string query = String.Format($"EXEC dbo.sp_SuaNhanVien @manv = N'{nv.MaNV}'," +
                                                                $"@tennv = N'{nv.TenNV}'," +
                                                                $"@sdt = N'{nv.Sdt}'," +
                                                                $"@phai = {nv.Phai}," +
                                                                $"@ngaysinh = N'{nv.NgaySinh.ToString("yyyy-MM-dd")}'," +
                                                                $"@email = N'{nv.Email}'," +
                                                                $"@macv = {nv.MaCV}," +
                                                                $"@trangthai = {nv.TrangThai}," +
                                                                $"@tentk = N'{nv.TenTK}'," +
                                                                $"@matkhau = N'{nv.MatKhau}'");
            db.Execute(query);
            if (nv.Hinh != null)
            {
                LuuAnh(nv, nv.Hinh);
            }
        }

        public void Xoa(NhanVien nv)
        {
            string query = String.Format($"EXEC dbo.sp_XoaNhanVien @manv = N'{nv.MaNV}'");
            db.Execute(query);
        }

        public byte[] ChuyenAnhThanhMangByte(PictureBox pt)
        {
            MemoryStream ms = new MemoryStream();
            pt.Image.Save(ms, pt.Image.RawFormat);
            return ms.ToArray();
        }

        public void LuuAnh(NhanVien nv, byte[] anh)
        {
            nv.Hinh = anh;
            using (SqlConnection conn = new SqlConnection(Properties.Settings.Default.cnnStr))
            {
                conn.Open();
                using (SqlCommand command = new SqlCommand("UPDATE dbo.NhanVien SET Hinh = @anh WHERE MaNV = @id ", conn))
                {
                    command.Parameters.AddWithValue("@id", nv.MaNV);
                    command.Parameters.AddWithValue("@anh", anh);

                    if (command.ExecuteNonQuery() > 0)
                        MessageBox.Show("Thao tác thành công", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Information);
                    else MessageBox.Show("Thao tác thất bại", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
                conn.Close();
            }
        }

        public NhanVien LayThongTinNhanVienBangTenTK(string tentk)
        {
            string query = string.Format("SELECT * FROM dbo.NhanVien WHERE TenTK = N'{0}'", tentk);
            DataTable result = db.LayDanhSach(query);

            foreach (DataRow dr in result.Rows)
            {
                return new NhanVien(dr);
            }
            return null;
        }

        public NhanVien LayThongTinNhanVienBangMaNV(string manv)
        {
            string query = string.Format("SELECT * FROM dbo.NhanVien WHERE MaNV = N'{0}'", manv);
            DataTable result = db.LayDanhSach(query);

            foreach (DataRow dr in result.Rows)
            {
                return new NhanVien(dr);
            }
            return null;
        }

        public DataTable TimKiem(string find)
        {
            string query = string.Format($"SELECT * FROM dbo.f_TimKiemNhanVien(N'{find}')");
            return db.LayDanhSach(query);
        }

        public DataTable TimKiem(string find, int trangthai)
        {
            string query = string.Format($"SELECT * FROM dbo.f_TimKiemNhanVien(N'{find}') where TrangThai = {trangthai}");
            return db.LayDanhSach(query);
        }
    }
}
