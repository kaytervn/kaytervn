using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Windows_W6_B2
{
    internal class Program
    {
        static void Main(string[] args)
        {
            using (var db = new AccountModelContext())
            {
                var dept = new Department
                {
                    Id = 1,
                    name = "Ke toan"
                };
                db.Departments.Add(dept);
                db.SaveChanges();

                var acc = new Account
                {
                    Id = 1,
                    name = "nva",
                    DepartmentId = 1
                };
                db.Accounts.Add(acc);
                db.SaveChanges();

                var query = from a in db.Accounts select a;

                foreach (var item in query)
                {
                    Console.WriteLine(item.name);
                }
            }
        }
    }
}
