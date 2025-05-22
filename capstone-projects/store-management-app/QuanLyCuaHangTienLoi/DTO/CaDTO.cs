using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyCuaHangTienLoi
{
    public partial class Ca
    {
        public Ca(string maCa, int loaiCa, TimeSpan gioBatDau, TimeSpan gioKetThuc)
        {
            MaCa = maCa;
            LoaiCa = loaiCa;
            GioBatDau = gioBatDau;
            GioKetThuc = gioKetThuc;
        }

        public Ca(DataRow row)
        {
            MaCa = (string)row["MaCa"];
            LoaiCa = (int)row["LoaiCa"];
            GioBatDau = (TimeSpan)row["GioBatDau"];
            GioKetThuc = (TimeSpan)row["GioKetThuc"];
        }
    }
}
