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
namespace QuanLyCuaHangTienLoi
{
    public partial class fNhanVien : Form
    {
        private Form CurrentFormChild;
        NhanVien nv = new NhanVien();
        ChucVuDAO cvDAO = new ChucVuDAO();

        public fNhanVien(NhanVien nv)
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

        private void btThanhToan_Click(object sender, EventArgs e)
        {
            btTitle.Text = btThanhToan.Text.ToUpper();
            btTitle.BackColor = btThanhToan.BackColor;
            OpenChildForm(new fThanhToan(this.nv));
        }

        private void fNhanVien_Load(object sender, EventArgs e)
        {
            tbTenNguoiDung.Text = nv.TenNV;
            btThongTinCaNhan_Click(null, null);
        }

        private void đăngXuấtToolStripMenuItem_Click(object sender, EventArgs e)
        {
            DialogResult dialogResult = MessageBox.Show("Bạn có thật sự muốn đăng xuất không?", "Thông báo", MessageBoxButtons.YesNo);
            if (dialogResult == DialogResult.Yes)
            {
                this.Close();
            }
        }

        private void btThongTinCaNhan_Click(object sender, EventArgs e)
        {
            btTitle.Text = btThongTinCaNhan.Text.ToUpper();
            btTitle.BackColor = btThongTinCaNhan.BackColor;
            OpenChildForm(new fThongTinCaNhan(this.nv));
        }

        private void btQLKhachHang_Click(object sender, EventArgs e)
        {
            btTitle.Text = btQLKhachHang.Text.ToUpper();
            btTitle.BackColor = btQLKhachHang.BackColor;
            OpenChildForm(new fQLKhachHang());
        }

        private void btPhanCong_Click(object sender, EventArgs e)
        {
            btTitle.Text = btPhanCong.Text.ToUpper();
            btTitle.BackColor = btPhanCong.BackColor;
            OpenChildForm(new fQLPhanCong(nv, 0));
        }
    }
}
