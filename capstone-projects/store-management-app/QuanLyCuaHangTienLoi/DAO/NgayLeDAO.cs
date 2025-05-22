using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyCuaHangTienLoi
{
    internal class NgayLeDAO
    {
        DBConnection exec = new DBConnection(Program.nv);

        public DataTable LayDanhSach()
        {
            return exec.LayDanhSach("Select * from NgayLe");
        }

        public void Them(NgayLe nl)
        {
            string query = string.Format($"EXECUTE dbo.sp_ThemNgayLe @ngay = '{nl.Ngay.ToString("yyyy-MM-dd")}', " +
                                         $"@sukien = N'{nl.SuKien}'");
            exec.Execute(query);
        }

        public void Sua(NgayLe nl)
        {
            string query = string.Format($"EXEC dbo.sp_SuaNgayLe @manl = {nl.MaNL}, " +
                                            $"@ngay = '{nl.Ngay.ToString("yyyy-MM-dd")}', " +
                                            $"@sukien = N'{nl.SuKien}'");
            exec.Execute(query);
        }

        public void Xoa(NgayLe nl)
        {
            string query = string.Format($"EXECUTE dbo.sp_XoaNgayLe @manl = {nl.MaNL}");
            exec.Execute(query);
        }
    }
}
