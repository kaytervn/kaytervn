﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyCongDanThanhPho
{
    public partial class Thue
    {
        public int MaThue { get; set; }
        public string TenThue { get; set; }
        public double MucThue { get; set; }
        public string CCCD { get; set; }
        public double ThuNhap { get; set; }
        public System.DateTime Ngay { get; set; }

        public virtual CanCuocCongDan CanCuocCongDan { get; set; }

        CanCuocCongDanDAO cccdDAO = new CanCuocCongDanDAO();

        public Thue(int maThue, string tenThue, double mucThue, string cCCD, double thuNhap, DateTime ngay)
        {
            MaThue = maThue;
            TenThue = tenThue;
            MucThue = mucThue;
            CCCD = cCCD;
            ThuNhap = thuNhap;
            Ngay = ngay;
            CanCuocCongDan = cccdDAO.LayThongTinCanCuocCongDanBangCCCD(CCCD);
        }

        public Thue(DataRow row)
        {
            this.MaThue = (int)row["MaThue"];
            this.TenThue = (string)row["TenThue"];
            this.MucThue = (double)row["MucThue"];
            this.CCCD = (string)row["CCCD"];
            this.ThuNhap = (double)row["ThuNhap"];
            this.Ngay = (DateTime)row["Ngay"];
            CanCuocCongDan = cccdDAO.LayThongTinCanCuocCongDanBangCCCD(CCCD);
        }
    }
}
