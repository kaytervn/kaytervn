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

namespace QLHocSinh_GiaoVien
{
    public partial class QLGiaoVienForm : Form
    {
        GiaoVienDAO gvDAO = new GiaoVienDAO();

        public QLGiaoVienForm()
        {
            InitializeComponent();
        }

        private void QLGiaoVienForm_Load(object sender, EventArgs e)
        {
            ReloadGV();
        }

        void ReloadGV()
        {
            dtGVGiaoVien.DataSource = gvDAO.LayDanhSach();
            ResetTextBox();
        }
        void ResetTextBox()
        {
            tbxHoTen.Text = "";
            tbxDiaChi.Text = "";
            tbxCMND.Text = "";
            cbxGioiTinh.Text = "";
            cbxBoMon.Text = "";
            dtPkNgaySinh.Value = DateTime.Today;
        }

        private void btnThem_Click(object sender, EventArgs e)
        {
            GiaoVien gv = new GiaoVien(tbxHoTen.Text, tbxDiaChi.Text, tbxCMND.Text, cbxGioiTinh.Text, cbxBoMon.Text, dtPkNgaySinh.Text);
            gvDAO.Them(gv);
            ReloadGV();
        }

        private void btnXoa_Click(object sender, EventArgs e)
        {
            GiaoVien gv = new GiaoVien(tbxHoTen.Text, tbxDiaChi.Text, tbxCMND.Text, cbxGioiTinh.Text, cbxBoMon.Text, dtPkNgaySinh.Text);
            gvDAO.Xoa(gv);
            ReloadGV();
        }

        private void btnSua_Click(object sender, EventArgs e)
        {
            GiaoVien gv = new GiaoVien(tbxHoTen.Text, tbxDiaChi.Text, tbxCMND.Text, cbxGioiTinh.Text, cbxBoMon.Text, dtPkNgaySinh.Text);
            gvDAO.Sua(gv);
            ReloadGV();
        }

        private void btnHome_Click(object sender, EventArgs e)
        {
            MainForm main = new MainForm();
            main.Show();
            Visible = false;
        }

        private void btnTimKiem_Click(object sender, EventArgs e)
        {
            GiaoVien gv = new GiaoVien(tbxHoTen.Text, tbxDiaChi.Text, tbxCMND.Text, cbxGioiTinh.Text, cbxBoMon.Text, dtPkNgaySinh.Text);
            dtGVGiaoVien.DataSource = gvDAO.TimKiem(gv);
        }

        private void btnReset_Click(object sender, EventArgs e)
        {
            ReloadGV();
        }

        private void tbxCMND_TextChanged(object sender, EventArgs e)
        {

        }

        private void button1_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }

        private void dtGVGiaoVien_CellContentClick(object sender, DataGridViewCellEventArgs e)
        {
            dtGVGiaoVien.CurrentRow.Selected = true;
            tbxHoTen.Text = dtGVGiaoVien.SelectedRows[0].Cells[0].Value.ToString();
            tbxDiaChi.Text = dtGVGiaoVien.SelectedRows[0].Cells[1].Value.ToString();
            tbxCMND.Text = dtGVGiaoVien.SelectedRows[0].Cells[2].Value.ToString();
            cbxGioiTinh.Text = dtGVGiaoVien.SelectedRows[0].Cells[3].Value.ToString();
            cbxBoMon.Text = dtGVGiaoVien.SelectedRows[0].Cells[4].Value.ToString();
            dtPkNgaySinh.Text = dtGVGiaoVien.SelectedRows[0].Cells[5].Value.ToString();
        }

        private void button2_Click(object sender, EventArgs e)
        {
            WindowState = FormWindowState.Minimized;
        }
    }
}
