using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QLHocSinh_GiaoVien
{
    public class GiaoVien
    {
        string name;
        string address;
        string id;
        string gender;
        string subject;
        string birthdate;

        public string HoTen { get => name; set => name = value; }
        public string DiaChi { get => address; set => address = value; }
        public string CMND { get => id; set => id = value; }
        public string GioiTinh { get => gender; set => gender = value; }
        public string NgaySinh { get => birthdate; set => birthdate = value; }
        public string BoMon { get => subject; set => subject = value; }

        public GiaoVien() { }

        public GiaoVien(string name, string address, string id, string gender, string subject, string birthdate)
        {
            this.name = name;
            this.address = address;
            this.id = id;
            this.gender = gender;
            this.subject = subject;
            this.birthdate = birthdate;
        }
    }
}
