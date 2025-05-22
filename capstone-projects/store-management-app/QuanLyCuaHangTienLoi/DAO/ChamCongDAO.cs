using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyCuaHangTienLoi
{
    internal class ChamCongDAO
    {
        DBConnection exec = new DBConnection(Program.nv);

        public DataTable LayDanhSach(int mapc)
        {
            return exec.LayDanhSach($"Select * from ChamCong WHERE MaPC = {mapc}");
        }

        public void CheckIn(ChamCong cc)
        {
            string query = string.Format($"EXEC dbo.UpDateGioBD @mapc = {cc.MaPC}," +
                                                              $"@giobd = '{cc.GioBD}'");
            exec.Execute(query);
        }

        public void CheckOut(ChamCong cc)
        {
            string query = string.Format($"EXEC dbo.UpDateGioKT @mapc = {cc.MaPC}," +
                                                              $"@giokt = '{cc.GioKT}'");
            if (exec.Execute(query) > 0)
            {
                TinhLuong(cc);
                ThemTinhLuong(cc);
            }    
        }

        public void TinhLuong(ChamCong cc)
        {
            string query = string.Format($"EXEC dbo.UpdateTinhLuong @mapc = {cc.MaPC}");
            exec.Execute(query);
        }

        public void ThemTinhLuong(ChamCong cc)
        {
            string query = string.Format($"EXEC dbo.ThemTinhLuong @mapc = {cc.MaPC}");
            exec.Execute(query);
        }

        public ChamCong LayThongTinChamCongBangMaPC(int mapc)
        {
            string query = string.Format("SELECT * FROM dbo.ChamCong WHERE MaPC = {0}", mapc);
            DataTable result = exec.LayDanhSach(query);

            foreach (DataRow dr in result.Rows)
            {
                return new ChamCong(dr);
            }
            return null;
        }
    }
}
