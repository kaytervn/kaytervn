using Baitap01Chuong04;
using BaitapChuong04;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KeThua_Chuong4_Bai1
{
    internal class Program
    {
        static void Main(string[] args)
        {
            try
            {
                NVKeToan nvkt1 = new NVKeToan("Khoa", "0123456789012", 2001, 50000, 20000);
                NVKeToan nvkt2 = new NVKeToan("Trung", "0124456789012", 2002, 32000, 15000);
                NVKeToan nvkt3 = new NVKeToan("Hao", "0125456789012", 1999, 63000, 6000);

                List<NVKeToan> dskt = new List<NVKeToan>();
                dskt.Add(nvkt1);
                dskt.Add(nvkt2);
                dskt.Add(nvkt3);

                NVKinhDoanh nvkd1 = new NVKinhDoanh("Tri", "0126456789012", 2003, 46000, 2);
                NVKinhDoanh nvkd2 = new NVKinhDoanh("Anh", "0127456789012", 2002, 72000, 3);
                NVKinhDoanh nvkd3 = new NVKinhDoanh("Tuan", "0128456789012", 1998, 81000, 1);

                List<NVKinhDoanh> dskd = new List<NVKinhDoanh>();
                dskd.Add(nvkd1);
                dskd.Add(nvkd2);
                dskd.Add(nvkd3);

                NVBaoVe nvbv1 = new NVBaoVe("Duc", "0129456789012", 2001, 15000, 4);
                NVBaoVe nvbv2 = new NVBaoVe("Hung", "0127556789012", 1997, 21000, 3);
                NVBaoVe nvbv3 = new NVBaoVe("Dung", "0128656789012", 1999, 25000, 5);

                List<NVBaoVe> dsbv = new List<NVBaoVe>();
                dsbv.Add(nvbv1);
                dsbv.Add(nvbv2);
                dsbv.Add(nvbv3);

                CongTy.TenCT = "TNHH G.A.P";
                CongTy.NVKT = dskt;
                CongTy.NVKD = dskd;
                CongTy.NVBV = dsbv;

                CongTy.TinhLuong();
                CongTy.Xuat();
            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }
    }
}
