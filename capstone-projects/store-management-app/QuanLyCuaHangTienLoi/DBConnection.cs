using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace QuanLyCuaHangTienLoi
{
    internal class DBConnection
    {
        SqlConnection conn = null;

        public DBConnection(NhanVien nv)
        {
            string cnnStr = "Data Source = (localdb)\\mssqllocaldb;Initial Catalog = QuanLyCuaHangTienLoi; " +
                                            $"User ID= {nv.TenTK};Password= {nv.MatKhau}";
            conn = new SqlConnection(cnnStr);
        }

        public DataTable LayDanhSach(string sqlStr)
        {
            try
            {
                conn.Open();
                SqlDataAdapter adapter = new SqlDataAdapter(sqlStr, conn);
                DataTable data = new DataTable();
                adapter.Fill(data);
                return data;
            }
            catch (SqlException ex)
            {
                MessageBox.Show("Lấy danh sách thất bại\n" + ex.Message, "Thông báo");
            }
            finally
            {
                conn.Close();
            }
            return null;
        }

        public String LayGiaTri(string sqlStr)
        {
            try
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(sqlStr, conn);
                String data = cmd.ExecuteScalar().ToString();
                return data;
            }
            catch (SqlException ex)
            {
                MessageBox.Show("Lấy giá trị thất bại\n" + ex.Message, "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            finally
            {
                conn.Close();
            }
            return null;
        }

        public int Execute(string query)
        {
            try
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(query, conn);

                int sql = cmd.ExecuteNonQuery();

                if (sql < 0)
                    MessageBox.Show("Thao tác thất bại", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);

                return sql;
            }
            catch (SqlException ex)
            {
                MessageBox.Show("Thất bại\n" + ex.Message, "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            finally
            {
                conn.Close();
            }
            return -1;
        }
    }
}
