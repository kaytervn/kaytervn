﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyCongDanThanhPho
{
    public partial class CongDan
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public CongDan()
        {
            this.CanCuocCongDans = new HashSet<CanCuocCongDan>();
            this.TamTruTamVangs = new HashSet<TamTruTamVang>();
        }

        public int MaCD { get; set; }
        public string HoTen { get; set; }
        public System.DateTime NgaySinh { get; set; }
        public string NoiSinh { get; set; }
        public int GioiTinh { get; set; }
        public string NgheNghiep { get; set; }
        public string DanToc { get; set; }
        public string TonGiao { get; set; }
        public int TinhTrang { get; set; }
        public int HonNhan { get; set; }
        public string TenTK { get; set; }
        public string MatKhau { get; set; }
        public int LoaiTK { get; set; }
        public double SoDu { get; set; }
        public byte[] Hinh { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<CanCuocCongDan> CanCuocCongDans { get; set; }
        public virtual KhaiSinh KhaiSinh { get; set; }
        public virtual KhaiTu KhaiTu { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<TamTruTamVang> TamTruTamVangs { get; set; }
        public virtual ThuongTru ThuongTru { get; set; }

        public enum enCD
        {
            Nam = 1,
            Nu = 0,
            ConSong = 1,
            QuaDoi = 0,
            DaKetHon = 1,
            DocThan = 0,
            QuanLy = 1,
            CongDan = 0
        };

        public CongDan(int maCD, string hoTen, DateTime ngaySinh, string noiSinh, int gioiTinh, string ngheNghiep, string danToc, string tonGiao, int tinhTrang, int honNhan, string tenTK, string matKhau, int loaiTK, double soDu, byte[] hinh)
        {
            MaCD = maCD;
            HoTen = hoTen;
            NgaySinh = ngaySinh;
            NoiSinh = noiSinh;
            GioiTinh = gioiTinh;
            NgheNghiep = ngheNghiep;
            DanToc = danToc;
            TonGiao = tonGiao;
            TinhTrang = tinhTrang;
            HonNhan = honNhan;
            TenTK = tenTK;
            MatKhau = matKhau;
            LoaiTK = loaiTK;
            SoDu = soDu;
            Hinh = hinh;
        }

        public CongDan(DataRow row)
        {
            this.MaCD = (int)row["MaCD"];
            this.HoTen = (string)row["HoTen"];
            this.NgaySinh = (DateTime)row["NgaySinh"];
            this.NoiSinh = (string)row["NoiSinh"];
            this.GioiTinh = (int)row["GioiTinh"];
            this.NgheNghiep = (string)row["NgheNghiep"];
            this.DanToc = (string)row["DanToc"];
            this.TonGiao = (string)row["TonGiao"];
            this.TinhTrang = (int)row["TinhTrang"];
            this.HonNhan = (int)row["HonNhan"];
            this.TenTK = (string)row["TenTK"];
            this.MatKhau = (string)row["MatKhau"];
            this.LoaiTK = (int)row["LoaiTK"];
            this.SoDu = (double)row["SoDu"];
            if (!Convert.IsDBNull(row["Hinh"]))
                this.Hinh = (byte[])row["Hinh"];
            else
                this.Hinh = null;
        }
    }
}
