using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace QLHocSinh_GiaoVien
{
    public class HocSinh
    {
        string name;
        string address;
        string id;
        string gender;
        string birthdate;

        public string HoTen { get => name; set => name = value; }
        public string DiaChi { get => address; set => address = value; }
        public string CMND { get => id; set => id = value; }
        public string GioiTinh { get => gender; set => gender = value; }
        public string NgaySinh { get => birthdate; set => birthdate = value; }

        public HocSinh() { }

        public HocSinh(string name, string address, string id, string gender, string birthdate)
        {
            this.name = name;
            this.address = address;
            this.id = id;
            this.gender = gender;
            this.birthdate = birthdate;
        }
    }
}
