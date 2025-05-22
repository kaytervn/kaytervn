using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Windows_W6
{
    internal static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            //Application.EnableVisualStyles();
            //Application.SetCompatibleTextRenderingDefault(false);
            //Application.Run(new Form1());
            using (var db = new QuanLyTruongHocEntities())
            {
                var std = new HocSinh
                {
                    MaHS = "HS1111",
                    Ten = "nva",
                    QueQuan = "Ha giang",
                    NgayThangNamSinh = DateTime.Now,
                    CMND = "123155",
                    SoDT = "12312312",
                    Email = "hs1@gmail.com"

                };
                db.HocSinhs.Add(std);
                db.SaveChanges();

                var query = from q in db.HocSinhs select q;

                foreach (var s in query)
                {
                    Console.WriteLine(s.Email);
                };
            }
        }
    }
}
