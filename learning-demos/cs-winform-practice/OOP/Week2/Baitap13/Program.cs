using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Baitap13
{
    internal class Program
    {
        static void Main(string[] args)
        {
            int m = Convert.ToInt32(Console.ReadLine());
            int n = Convert.ToInt32(Console.ReadLine());
            int[,] A = new int[m,n];
            for(int i=0;i<m;i++)
            {
                for(int j=0;j<n;j++)
                {
                    A[i,j] = Convert.ToInt32(Console.ReadLine());
                }
            }
            Find(A, m, n);
        }

        static void Find(int[,] A, int m, int n)
        {
            for (int i = 0; i < m; i++)
            {
                int max = A[i,0];
                int min = A[i,0];
                for (int j = 0; j < n; j++)
                {
                    if (A[i,j] > max)
                    {
                        max = A[i,j];
                    }

                    if (A[i,j] < min)
                    {
                        min = A[i,j];
                    }
                }
                Console.WriteLine("Dong " + i + ": ");
                Console.WriteLine("max = " + max);
                Console.WriteLine("min = " + min +"\n");
            }

            for (int j = 0; j < n; j++)
            {
                int max = A[0, j];
                int min = A[0, j];
                for (int i = 0; i < m; i++)
                {
                    if (A[i, j] > max)
                    {
                        max = A[i, j];
                    }

                    if (A[i, j] < min)
                    {
                        min = A[i, j];
                    }
                }
                Console.WriteLine("Cot " + j + ": ");
                Console.WriteLine("max = " + max);
                Console.WriteLine("min = " + min + "\n");
            }

        }
    }
}
