using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace QuanLyCuaHangTienLoi
{
    public partial class fQuanLy : Form
    {
        private Form CurrentFormChild;
        NhanVien nv = new NhanVien();

        public fQuanLy(NhanVien nv)
        {
            InitializeComponent();
            this.nv = nv;
        }

        public void OpenChildForm(Form FormChild)
        {
            if (CurrentFormChild != null)
                CurrentFormChild.Close();
            CurrentFormChild = FormChild;
            FormChild.TopLevel = false;
            FormChild.FormBorderStyle = FormBorderStyle.None;
            FormChild.Dock = DockStyle.Fill;
            pnBody.Controls.Add(FormChild);
            pnBody.Tag = FormChild;
            FormChild.BringToFront();
            FormChild.Show();
        }

        private void đăngXuấtToolStripMenuItem_Click(object sender, EventArgs e)
        {
            DialogResult dialogResult = MessageBox.Show("Bạn có thật sự muốn đăng xuất không?", "Thông báo", MessageBoxButtons.YesNo);
            if (dialogResult == DialogResult.Yes)
            {
                this.Close();
            }
        }

        private void fQuanLy_Load(object sender, EventArgs e)
        {
            tbTenNguoiDung.Text = nv.TenNV;
            btQuanLyNhanVien_Click(null, null);
        }

        private void btQuanLyNhanVien_Click(object sender, EventArgs e)
        {
            btTitle.Text = btQuanLyNhanVien.Text.ToUpper();
            btTitle.BackColor = btQuanLyNhanVien.BackColor;
            OpenChildForm(new fQLNhanVien());
        }

        private void btQuanLyKhachHang_Click(object sender, EventArgs e)
        {
            btTitle.Text = btQuanLyKhachHang.Text.ToUpper();
            btTitle.BackColor = btQuanLyKhachHang.BackColor;
            OpenChildForm(new fQLKhachHang());
        }

        private void btQLNhapKho_Click(object sender, EventArgs e)
        {
            btTitle.Text = btQLNhapKho.Text.ToUpper();
            btTitle.BackColor = btQLNhapKho.BackColor;
            OpenChildForm(new fQLNhapKho());
        }

        private void btQLXuatKho_Click(object sender, EventArgs e)
        {
            btTitle.Text = btQLXuatKho.Text.ToUpper();
            btTitle.BackColor = btQLXuatKho.BackColor;
            OpenChildForm(new fQLXuatKho());
        }

        private void btQLPhanCong_Click(object sender, EventArgs e)
        {
            btTitle.Text = btQLPhanCong.Text.ToUpper();
            btTitle.BackColor = btQLPhanCong.BackColor;
            OpenChildForm(new fQLPhanCong(nv, 1));
        }

        private void btLuong_Click(object sender, EventArgs e)
        {
            btTitle.Text = btLuong.Text.ToUpper();
            btTitle.BackColor = btLuong.BackColor;
            OpenChildForm(new fQLLuong());
        }

        private void btDoanhThu_Click(object sender, EventArgs e)
        {
            btTitle.Text = btDoanhThu.Text.ToUpper();
            btTitle.BackColor = btDoanhThu.BackColor;
            OpenChildForm(new fDoanhThu());
        }
    }
}
