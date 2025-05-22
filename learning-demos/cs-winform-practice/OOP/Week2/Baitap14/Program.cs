using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Baitap14
{
    internal class Program
    {
        static void Main(string[] args)
        {
            int m = Convert.ToInt32(Console.ReadLine());
            int n = Convert.ToInt32(Console.ReadLine());
            int[,] A = new int[m, n];
            for (int i = 0; i < m; i++)
            {
                for (int j = 0; j < n; j++)
                {
                    A[i, j] = Convert.ToInt32(Console.ReadLine());
                }
            }
            int khong = Find(A, m, n);

            if (khong == 0)
                Console.WriteLine("Khong co");
        }

        static int Find(int[,] A, int m, int n)
        {
            for(int i= 0; i < m; i++)
            {
                for(int j=0;j<n;j++)
                {
                    if (A[i,j]<0)
                    {
                        Console.WriteLine(A[i, j]);
                        return 1;
                    }
                }
            }
            return 0;

        }
    }
}
