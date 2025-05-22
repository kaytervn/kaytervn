using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Baitap4
{
    internal class Program
    {
        static void Main(string[] args)
        {
            double toan = Convert.ToInt32(Console.ReadLine());
            double ly = Convert.ToInt32(Console.ReadLine());
            double hoa = Convert.ToInt32(Console.ReadLine());

            double kq = (toan + ly + hoa) / 3;

            if (kq >= 9)
                Console.WriteLine("Xuat sac");
            else if (kq >= 8 && kq < 9)
                Console.WriteLine("Gioi");
            else if (kq >= 7 && kq < 8)
                Console.WriteLine("Kha");
            else if (kq >= 6 && kq < 7)
                Console.WriteLine("Trung binh");
            else
                Console.WriteLine("Yeu");

        }
    }
}
