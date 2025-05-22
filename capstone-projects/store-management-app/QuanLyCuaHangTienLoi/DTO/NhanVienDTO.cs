using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;
using static System.Windows.Forms.VisualStyles.VisualStyleElement.ListView;

namespace QuanLyCuaHangTienLoi
{
    public partial class NhanVien
    {
        public NhanVien(string maNV, string tenNV, string sdt, bool phai, DateTime ngaySinh, string email, int maCV, bool trangThai, string tenTK, string matKhau, byte[] hinh)
        {
            MaNV = maNV;
            TenNV = tenNV;
            Sdt = sdt;
            Phai = phai;
            NgaySinh = ngaySinh;
            Email = email;
            MaCV = maCV;
            TrangThai = trangThai;
            TenTK = tenTK;
            MatKhau = matKhau;
            Hinh = hinh;
        }
        public NhanVien(string tenNV, string sdt, bool phai, DateTime ngaySinh, string email, int maCV, bool trangThai, string tenTK, string matKhau, byte[] hinh)
        {
            TenNV = tenNV;
            Sdt = sdt;
            Phai = phai;
            NgaySinh = ngaySinh;
            Email = email;
            MaCV = maCV;
            TrangThai = trangThai;
            TenTK = tenTK;
            MatKhau = matKhau;
            Hinh = hinh;
        }
        public NhanVien(string manv)
        {
            MaNV = manv;
        }

        public NhanVien(DataRow row)
        {
            MaNV = (string)row["MaNV"];
            TenNV = (string)row["TenNV"];
            Sdt = (string)row["Sdt"];
            Phai = (bool)row["Phai"];
            NgaySinh = (DateTime)row["NgaySinh"];
            Email = (string)row["Email"];
            MaCV = (int)row["MaCV"];
            TrangThai = (bool)row["TrangThai"];
            TenTK = (string)row["TenTK"];
            MatKhau = (string)row["MatKhau"];

            if (!Convert.IsDBNull(row["Hinh"]))
                this.Hinh = (byte[])row["Hinh"];
            else
                this.Hinh = null;
        }
    }
}
