using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Data.SqlClient;
using System.Collections;

namespace BaiTapChuong3
{
    public partial class fNhanVien : Form
    {
        SqlConnection conn = new SqlConnection(Properties.Settings.Default.cnnStr);

        public fNhanVien()
        {
            InitializeComponent();
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
            catch (Exception ex)
            {
                MessageBox.Show("Lấy danh sách thất bại" + ex);
            }
            finally
            {
                conn.Close();
            }
            return null;
        }

        void ReloadData()
        {
            dtgvNhanVien.DataSource = LayDanhSach("SELECT * FROM NhanVien");
        }

        public void Excute(string query)
        {
            try
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(query, conn);

                if (cmd.ExecuteNonQuery() > 0)
                    MessageBox.Show("Thành công");
                else MessageBox.Show("Thất bại");
            }
            catch (Exception ex)
            {
                MessageBox.Show("Thất bại" + ex);
            }
            finally
            {
                conn.Close();
            }
        }

        private void fNhanVien_Load(object sender, EventArgs e)
        {
            ReloadData();
        }

        private void btnThem_Click(object sender, EventArgs e)
        {
            string sqlStr = string.Format("EXEC dbo.USP_ThemNhanVien @manv = N'{0}', @tennv = N'{1}', @sdt = N'{2}', @phai = N'{3}', @tuoi = {4}, @ngaysinh = '{5}', @email = N'{6}'", tbMaNV.Text, tbTenNV.Text, tbSDT.Text, tbPhai.Text, tbTuoi.Text, dtpkNgaySinh.Text, tbEmail.Text);
            Excute(sqlStr);
            ReloadData();
        }

        private void btnXoa_Click(object sender, EventArgs e)
        {
            string sqlStr = string.Format("EXEC dbo.USP_XoaNhanVien @manv = N'{0}'", tbMaNV.Text);
            Excute(sqlStr);
            ReloadData();
        }

        private void btnSua_Click(object sender, EventArgs e)
        {
            string sqlStr = string.Format("EXEC dbo.USP_SuaNhanVien @manv = N'{0}', @tennv = N'{1}', @sdt = N'{2}', @phai = N'{3}', @tuoi = {4}, @ngaysinh = '{5}', @email = N'{6}'", tbMaNV.Text, tbTenNV.Text, tbSDT.Text, tbPhai.Text, tbTuoi.Text, dtpkNgaySinh.Text, tbEmail.Text);
            Excute(sqlStr);
            ReloadData();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            string sqlStr = string.Format("select * from dbo.SPHetHan");
            dtgvNhanVien.DataSource = LayDanhSach(sqlStr);
        }

        private void btnXem_Click(object sender, EventArgs e)
        {
            ReloadData();
        }
    }
}
