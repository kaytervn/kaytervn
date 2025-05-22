using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using static System.Net.Mime.MediaTypeNames;

namespace QuanLyCuaHangTienLoi
{
    internal class SanPhamDAO
    {
        DBConnection db = new DBConnection(Program.nv);
        public DataTable LayDanhSach()
        {
            string sql = "Select * from SanPham";
            return db.LayDanhSach(sql);
        }

        public DataTable LayDanhSach(int trangthai)
        {
            string sql = $"Select * from SanPham where TrangThai = {trangthai}";
            return db.LayDanhSach(sql);
        }

        public void Them(SanPham sp)
        {

            string query = String.Format($"EXEC dbo.sp_ThemSanPham @tensp = N'{sp.TenSP}'," +
                                                                $"@mansx= {sp.MaNSX}," +
                                                                $"@maloai = {sp.MaLoai}," +
                                                                $"@giaban = {sp.GiaBan}," +
                                                                $"@giagoc = {sp.GiaGoc}," +
                                                                $"@trangthai = {sp.TrangThai}");
            db.Execute(query);
            SanPham nSP = LayThongTinSP(sp);
            sp.MaSP = nSP.MaSP;
            if (sp.Hinh != null)
            {
                LuuAnh(sp, sp.Hinh);
            }
        }

        public void Sua(SanPham sp)
        {
            
            string query = String.Format($"EXEC dbo.sp_SuaSanPham @masp = {sp.MaSP}," +
                                                                $"@tensp = N'{sp.TenSP}'," +
                                                                $"@mansx= {sp.MaNSX}," +
                                                                $"@maloai = {sp.MaLoai}," +
                                                                $"@giaban = {sp.GiaBan}," +
                                                                $"@giagoc = {sp.GiaGoc}," +
                                                                $"@trangthai = {sp.TrangThai}");
            db.Execute(query);
            if (sp.Hinh != null)
            {
                LuuAnh(sp, sp.Hinh);
            }
        }

        public void Xoa(SanPham sp)
        {
            string query = String.Format($"EXEC dbo.sp_XoaSanPham @masp = {sp.MaSP}");

            db.Execute(query);
        }

        public void LuuAnh(SanPham nv, byte[] anh)
        {
            nv.Hinh = anh;
            using (SqlConnection conn = new SqlConnection(Properties.Settings.Default.cnnStr))
            {
                conn.Open();
                using (SqlCommand command = new SqlCommand("UPDATE dbo.SanPham SET Hinh = @anh WHERE MaSP = @id ", conn))
                {
                    command.Parameters.AddWithValue("@id", nv.MaSP);
                    command.Parameters.AddWithValue("@anh", anh);
                    command.ExecuteNonQuery();
                }
                conn.Close();
            }
        }

        public SanPham LayThongTinSP(SanPham sp)
        {
            string query = string.Format($"SELECT * FROM dbo.SanPham WHERE TenSP = N'{sp.TenSP}' and " +
                                        $"MaNSX= {sp.MaNSX} and " +
                                        $"MaLoai = {sp.MaLoai} and " +
                                        $"GiaBan = {sp.GiaBan} and " +
                                        $"GiaGoc = {sp.GiaGoc} and " +
                                        $"TrangThai = '{sp.TrangThai}'");
            DataTable result = db.LayDanhSach(query);

            foreach (DataRow dr in result.Rows)
            {
                return new SanPham(dr);
            }
            return null;
        }

        public SanPham LayThongTinSanPhamBangMaSP(int masp)
        {
            string query = string.Format($"SELECT * FROM dbo.SanPham WHERE MaSP = {masp}");
            DataTable result = db.LayDanhSach(query);

            foreach (DataRow dr in result.Rows)
            {
                return new SanPham(dr);
            }
            return null;
        }

        public DataTable TimKiem(string find)
        {
            string query = string.Format($"SELECT * FROM dbo.f_TimKiemSanPham(N'{find}')");
            return db.LayDanhSach(query);
        }

        public DataTable TimKiem(string find, int trangthai)
        {
            string query = string.Format($"SELECT * FROM dbo.f_TimKiemSanPham(N'{find}') where TrangThai = {trangthai}");
            return db.LayDanhSach(query);
        }
    }
}
