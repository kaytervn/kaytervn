using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyTruongHoc
{
    public class HocSinh
    {
        string maHS;
        string ten;
        string queQuan;
        string ngaySinh;
        string CMND;
        string email;
        string soDT;
        double diem;

        public string MaHS { get => maHS; set => maHS = value; }
        public string Ten { get => ten; set => ten = value; }
        public string QueQuan { get => queQuan; set => queQuan = value; }
        public string NgaySinh { get => ngaySinh; set => ngaySinh = value; }
        public string CMND1 { get => CMND; set => CMND = value; }
        public string Email { get => email; set => email = value; }
        public string SoDT { get => soDT; set => soDT = value; }
        public double Diem { get => diem; set => diem = value; }

        public HocSinh()
        { }

        public HocSinh(string maHS, string ten, string queQuan, string ngaySinh, string cMND, string email, string soDT, double diem)
        {
            this.maHS = maHS;
            this.ten = ten;
            this.queQuan = queQuan;
            this.ngaySinh = ngaySinh;
            this.CMND = cMND;
            this.email = email;
            this.soDT = soDT;
            this.diem = diem;
        }
    }
}
