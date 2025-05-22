using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Baitap8
{
    internal class Program
    {
        static void Main(string[] args)
        {
            int n=Convert.ToInt32(Console.ReadLine());
            if (SNT(n) == true)
                Console.WriteLine("n la SNT");
            else
                Console.WriteLine("n khong la SNT");
        }
        static bool SNT(int n)
        {
            if (n < 2)
                return false;

            if (n == 2)
                return true;

            for (int i = 1; i <= Math.Sqrt(n); i++)
            {
                if (n % 2 == 0)
                    return false;
            }

            return true;
        }
    }
}
