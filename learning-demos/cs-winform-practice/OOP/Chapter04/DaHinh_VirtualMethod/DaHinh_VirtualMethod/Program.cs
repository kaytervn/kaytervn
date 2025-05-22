using KeThua_Chuong4_Bai2;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DaHinh_VirtualMethod
{
    internal class Program
    {
        static void Main(string[] args)
        {
            //Please, run in debugging mode 5 times
            DoanThang h1 = new DoanThang();
            HinhChuNhat h2 = new HinhChuNhat();
            HinhTron h3 = new HinhTron();

            List<Hinh> lHinh = new List<Hinh>();
            lHinh.Add(h1);
            lHinh.Add(h2);
            lHinh.Add(h3);

            foreach (Hinh h in lHinh)
            {
                h.Ve();
            }

            //Get a object from the list
            DoanThang dt = (DoanThang)lHinh[0];
            dt.Ve();
        }
    }
}
