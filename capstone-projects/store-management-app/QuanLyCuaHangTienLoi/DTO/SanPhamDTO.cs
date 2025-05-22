using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;
using static System.Windows.Forms.VisualStyles.VisualStyleElement.ListView;

namespace QuanLyCuaHangTienLoi
{
    public partial class SanPham
    {
        public SanPham(int maSP, string tenSP, int maNSX, int maLoai, double giaBan, double giaGoc, bool trangThai)
        {
            MaSP = maSP;
            TenSP = tenSP;
            MaNSX = maNSX;
            MaLoai = maLoai;
            GiaBan = giaBan;
            GiaGoc = giaGoc;
            TrangThai = trangThai;
        }

        public SanPham(int maSP, string tenSP, int maNSX, int maLoai, double giaBan, double giaGoc, bool trangThai, byte[] hinh)
        {
            MaSP = maSP;
            TenSP = tenSP;
            MaNSX = maNSX;
            MaLoai = maLoai;
            GiaBan = giaBan;
            GiaGoc = giaGoc;
            TrangThai = trangThai;
            Hinh = hinh;
        }

        public SanPham(string tenSP, int maNSX, int maLoai, double giaBan, double giaGoc, bool trangThai)
        {
            TenSP = tenSP;
            MaNSX = maNSX;
            MaLoai = maLoai;
            GiaBan = giaBan;
            GiaGoc = giaGoc;
            TrangThai = trangThai;
        }

        public SanPham(string tenSP, int maNSX, int maLoai, double giaBan, double giaGoc, bool trangThai, byte[] hinh)
        {
            TenSP = tenSP;
            MaNSX = maNSX;
            MaLoai = maLoai;
            GiaBan = giaBan;
            GiaGoc = giaGoc;
            TrangThai = trangThai;
            Hinh = hinh;
        }

        public SanPham(int maSP)
        {
            MaSP = maSP;
        }

        public SanPham(DataRow row)
        {
            MaSP = (int)row["MaSP"];
            MaNSX = (int)row["MaNSX"];
            MaLoai = (int)row["MaLoai"];
            TrangThai = (bool)row["TrangThai"];
            TenSP = (string)row["TenSP"];
            GiaBan = (double)row["GiaBan"];
            GiaGoc = (double)row["GiaGoc"];

            if (!Convert.IsDBNull(row["Hinh"]))
                this.Hinh = (byte[])row["Hinh"];
            else
                this.Hinh = null;
        }
    }
}
