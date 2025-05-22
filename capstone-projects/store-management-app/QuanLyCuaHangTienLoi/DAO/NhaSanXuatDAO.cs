using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyCuaHangTienLoi
{
    internal class NhaSanXuatDAO
    {
        DBConnection exec = new DBConnection(Program.nv);

        public DataTable LayDanhSach()
        {
            return exec.LayDanhSach("Select * from NhaSanXuat");
        }

        public void Them(NhaSanXuat nsx)
        {
            string query = string.Format($"EXEC dbo.sp_ThemNSX @tennsx = N'{nsx.TenNSX}'," +
                                        $"@diachi = N'{nsx.DiaChi}'");
            exec.Execute(query);
        }

        public void Sua(NhaSanXuat nsx)
        {
            string query = string.Format($"EXEC dbo.sp_SuaNSX @mansx = {nsx.MaNSX}, " +
                                        $"@tennsx = N'{nsx.TenNSX}', " +
                                        $"@diachi = N'{nsx.DiaChi}'");
            exec.Execute(query);
        }

        public void Xoa(NhaSanXuat nsx)
        {
            string query = string.Format($"EXECUTE dbo.sp_XoaNSX @mansx = {nsx.MaNSX}");
            exec.Execute(query);
        }
    }
}
