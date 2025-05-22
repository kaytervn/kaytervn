using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tuan1_KienDucTrong21110332
{
    internal partial class HinhHoc
    {
        static void TuongDoiHinhChuNhat(HinhHoc a, HinhHoc b)
        {
            if (b.GetType() == typeof(Diem))
            {
                
            }
            if (b.GetType() == typeof(DuongThang))
            {
                
            }
            if (b.GetType() == typeof(HinhTron))
            {
                
            }
            if (b.GetType() == typeof(HinhTamGiac))
            {
                
            }
            if (b.GetType() == typeof(HinhVuong))
            {
                
            }
            if (b.GetType() == typeof(HinhChuNhat))
            {
                HinhChuNhat_HinhChuNhat((HinhChuNhat)a, (HinhChuNhat)b);
            }
        }

        public static void HinhChuNhat_HinhChuNhat(HinhChuNhat a, HinhChuNhat b)
        {

        }
    }
}
