using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BTTuan1
{
    internal class HocSinh
    {
        private string name;
        private string diachi;
        private string cmnd;

        public string Name { get { return name; } }
        public string Diachi { get { return diachi; } }
        public string Cmnd { get { return cmnd; } }

        public HocSinh()
        {}

        public HocSinh(string n, string d, string c)
        {
            this.name = n;
            this.diachi = d;
            this.cmnd = c;
        }
    }
}
