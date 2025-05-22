using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Baitap6
{
    internal class Program
    {
        static void Main(string[] args)
        {
            int n=Convert.ToInt32(Console.ReadLine());
            int[] A = new int[n];
            int dem = 0;
            double s = 0;
            for(int i=0;i<n;i++)
            {
                A[i] = Convert.ToInt32(Console.ReadLine());
                if (A[i] < 0)
                {
                    dem++;
                    s = +A[i];
                }
            }

            double kq = s/dem;
            Console.WriteLine("Trung binh cong so am = " + kq);
        }
    }
}
