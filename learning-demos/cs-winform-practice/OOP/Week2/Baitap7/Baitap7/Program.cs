using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Baitap7
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Nhap k: ");
            int k = Convert.ToInt32(Console.ReadLine());
            Console.WriteLine("Nhap n: ");
            int n=Convert.ToInt32(Console.ReadLine());
            Console.WriteLine(ToHop(n,k));
        }

        static int ToHop(int n, int k)
        {
            if (k == 0)
                return 1;
            return ToHop(n - 1, k - 1) + ToHop(k, n - 1);
        }
    }
}
