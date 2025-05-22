using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyCuaHangTienLoi
{
    internal class TinhLuongDAO
    {
        DBConnection exec = new DBConnection(Program.nv);

        public DataTable LayDanhSach()
        {
            return exec.LayDanhSach($"Select * from TinhLuong");
        }

        public DataTable LayDanhSach(string manv)
        {
            return exec.LayDanhSach($"Select * from TinhLuong WHERE MaNV = '{manv}'");
        }
    }
}
