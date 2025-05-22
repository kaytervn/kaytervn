using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Baitap3
{
    internal class Program
    {
        enum phepToan
        {
            Cong = 1,
            Tru = 2,
            Nhan = 3,
            Chia = 4
        }
        static void Main(string[] args)
        {
            double a = Convert.ToInt32(Console.ReadLine());
            double b = Convert.ToInt32(Console.ReadLine());
            Console.WriteLine("Chon dau (Cong = 1, Tru = 2, Nhan = 3, Chia = 4): ");
            int dau = Convert.ToInt32(Console.ReadLine());

            switch(dau)
            {
                case (int)phepToan.Cong:
                    double tong = a + b;
                    Console.WriteLine("A + B = " + tong);
                    break;
                case (int)phepToan.Tru:
                    double hieu = a - b;
                    Console.WriteLine("A - B = " + hieu);
                    break;
                case (int)phepToan.Nhan:
                    double tich = a * b;
                    Console.WriteLine("A * B = " + tich);
                    break;
                case (int)phepToan.Chia:
                    double thuong = a / b;
                    Console.WriteLine("A / B = " + thuong);
                    break;
            }
        }
    }
}
