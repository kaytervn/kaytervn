using Chuong05_BTTL;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Configuration;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace Chuong05_BTTL
{
    internal class HinhPhucHop:Hinh
    {
        //Fields
        List<Hinh> lH;
        double dDienTich;

        //Properties
        public List<Hinh> DSH
        {
            set { this.lH = value; }
            get { return this.lH; }
        }

        //Constructors
        public HinhPhucHop() : base()
        {
            this.lH = new List<Hinh>();
        }

        public HinhPhucHop(List<Hinh> DSH)
        {
            this.lH = DSH;
        }

        //Destructors
        ~HinhPhucHop() { }

        //Input
        public override void Nhap()
        {
            Console.WriteLine("Nhap so luong doan thang: ");
            int soDT = Convert.ToInt32(Console.ReadLine());
            for (int i = 0; i < soDT; i++)
            {
                DoanThang dt = new DoanThang();
                dt.Nhap();
                this.lH.Add(dt);
            }

            Console.WriteLine("Nhap so luong hinh chu nhat: ");
            int SoHCN = Convert.ToInt32(Console.ReadLine());
            for (int i = 0; i < SoHCN; i++)
            {
                HinhChuNhat hcn = new HinhChuNhat();
                hcn.Nhap();
                this.lH.Add(hcn);
            }

            Console.WriteLine("Nhap so luong hinh tam giac: ");
            int soTG = Convert.ToInt32(Console.ReadLine());
            for (int i = 0; i < soTG; i++)
            {
                HinhTamGiac tg = new HinhTamGiac();
                tg.Nhap();
                this.lH.Add(tg);
            }
        }

        //Output
        public override void Xuat()
        {
            Console.WriteLine("\nHinh phuc hop: ");
            base.Xuat();
            Console.WriteLine("\nDanh sach cac hinh: ");
            for (int i = 0; i < this.lH.Count; i++)
            {
                Console.WriteLine($"\n\tHinh thu {i + 1}:");
                this.lH[i].Xuat();
            }
            Console.WriteLine("\nDien tich Hinh phuc hop: " + this.dDienTich);
        }

        public override void TinhKichThuoc()
        {
            for (int i = 0; i < this.lH.Count; i++)
            {
                this.lH[i].TinhKichThuoc();
            }
        }

        public override void Ve()
        {
            Console.WriteLine();
            Console.WriteLine("Ve khung hinh:");
        }

        public void TimToaDo()
        {
            int xm = Math.Min(this.lH[0].a.x, this.lH[0].b.x);
            int xM = Math.Max(this.lH[0].a.x, this.lH[0].b.x);

            int ym = Math.Min(this.lH[0].a.y, this.lH[0].b.y);
            int yM = Math.Max(this.lH[0].a.y, this.lH[0].b.y);

            for (int i = 0; i < this.lH.Count; i++)
            {
                if (Math.Min(this.lH[i].a.x, this.lH[i].b.x) < xm)
                    xm = Math.Min(this.lH[i].a.x, this.lH[i].b.x);
                if (Math.Max(this.lH[i].a.x, this.lH[i].b.x) > xM)
                    xM = Math.Max(this.lH[i].a.x, this.lH[i].b.x);

                if (Math.Min(this.lH[i].a.y, this.lH[i].b.y) < ym)
                    ym = Math.Min(this.lH[i].a.y, this.lH[i].b.y);
                if (Math.Max(this.lH[i].a.y, this.lH[i].b.y) > yM)
                    yM = Math.Max(this.lH[i].a.y, this.lH[i].b.y);
            }

            Diem m = new Diem(xm, yM);
            Diem M = new Diem(xM, ym);

            this.a = m;
            this.b = M;
        }

        public void TinhDienTich()
        {
            this.dDienTich = (this.b.x - this.a.x) * (this.a.y - this.b.y);
        }

        public override void Move(Diem pos)
        {
            foreach (Hinh h in this.lH)
            {
                h.Move(pos);
            }
            this.a.x += pos.x;
            this.b.x += pos.x;
            this.a.y += pos.y;
            this.b.y += pos.y;
        }

        public void Merge(Hinh h)
        {
            this.lH.Add(h);
            this.TimToaDo();
            this.TinhKichThuoc();
            this.TinhDienTich();
        }

        public Hinh Divided(HinhPhucHop hl)
        {
            Hinh hm = hl.DSH[hl.DSH.Count - 1];
            hl.DSH.RemoveAt(hl.DSH.Count - 1);
            this.TimToaDo();
            this.TinhKichThuoc();
            this.TinhDienTich();
            return hm;
        }

        public override void DoiMau(string mau)
        {
            this.sMau = mau;
            foreach(Hinh h in this.lH)
            {
                h.DoiMau(mau);
            }
        }
    }
}
