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
using static System.Windows.Forms.VisualStyles.VisualStyleElement;

namespace QLHocSinh_GiaoVien
{
    public partial class QLHocSinhForm : Form
    {
        HocSinhDAO hsDAO = new HocSinhDAO();
        public QLHocSinhForm()
        {
            InitializeComponent();
        }

        private void QLHocSinhForm_Load(object sender, EventArgs e)
        {
            ReloadGV();
        }

        void ReloadGV()
        {
            dtGVHocSinh.DataSource = hsDAO.LayDanhSach();
            ResetTextBox();
        }

        void ResetTextBox()
        {
            tbxHoTen.Text = "";
            tbxDiaChi.Text = "";
            tbxCMND.Text = "";
            cbxGioiTinh.Text = "";
            dtPkNgaySinh.Value = DateTime.Today;
        }

        private void btnThem_Click(object sender, EventArgs e)
        {
            HocSinh hs = new HocSinh(tbxHoTen.Text, tbxDiaChi.Text, tbxCMND.Text, cbxGioiTinh.Text, dtPkNgaySinh.Text);
            hsDAO.Them(hs);
            ReloadGV();
        }

        private void btnXoa_Click(object sender, EventArgs e)
        {
            HocSinh hs = new HocSinh(tbxHoTen.Text, tbxDiaChi.Text, tbxCMND.Text, cbxGioiTinh.Text, dtPkNgaySinh.Text);
            hsDAO.Xoa(hs);
            ReloadGV();
        }

        private void btnSua_Click(object sender, EventArgs e)
        {
            HocSinh hs = new HocSinh(tbxHoTen.Text, tbxDiaChi.Text, tbxCMND.Text, cbxGioiTinh.Text, dtPkNgaySinh.Text);
            hsDAO.Sua(hs);
            ReloadGV();
        }

        private void dtGVHocSinh_CellContentClick(object sender, DataGridViewCellEventArgs e)
        {
            dtGVHocSinh.CurrentRow.Selected = true;
            tbxHoTen.Text = dtGVHocSinh.SelectedRows[0].Cells[0].Value.ToString();
            tbxDiaChi.Text = dtGVHocSinh.SelectedRows[0].Cells[1].Value.ToString();
            tbxCMND.Text = dtGVHocSinh.SelectedRows[0].Cells[2].Value.ToString();
            cbxGioiTinh.Text = dtGVHocSinh.SelectedRows[0].Cells[3].Value.ToString();
            dtPkNgaySinh.Text = dtGVHocSinh.SelectedRows[0].Cells[4].Value.ToString();
        }

        private void btnTimKiem_Click(object sender, EventArgs e)
        {
            HocSinh hs = new HocSinh(tbxHoTen.Text, tbxDiaChi.Text, tbxCMND.Text, cbxGioiTinh.Text, dtPkNgaySinh.Text);
            dtGVHocSinh.DataSource = hsDAO.TimKiem(hs);
        }

        private void btnReset_Click(object sender, EventArgs e)
        {
            ReloadGV();
        }

        private void btnHome_Click(object sender, EventArgs e)
        {
            MainForm main = new MainForm();
            main.Show();
            Visible = false;
        }

        private void button1_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }

        private void button2_Click(object sender, EventArgs e)
        {
            WindowState = FormWindowState.Minimized;
        }
    }
}
