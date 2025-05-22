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
    public partial class fDangNhap : Form
    {
        NhanVienDAO nvDAO = new NhanVienDAO();

        public fDangNhap()
        {
            InitializeComponent();
        }

        private void fDangNhap_Load(object sender, EventArgs e)
        {

        }

        private void btnLogin_Click(object sender, EventArgs e)
        {
            try
            {
                Program.nv = nvDAO.KiemTraDangNhap(tbxUserName.Text, tbxPassword.Text);
                if (Program.nv != null)
                {
                    if (rbQuanLy.Checked == true)
                    {
                        if (Program.nv.MaCV == 1)
                        {
                            fQuanLy ql = new fQuanLy(Program.nv);
                            this.Hide();
                            ql.ShowDialog();
                            this.Show();
                        }
                        else
                            MessageBox.Show("Bạn không có quyền truy cập vào quản lý!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    }
                    else
                    {
                        fNhanVien form = new fNhanVien(Program.nv);
                        this.Hide();
                        form.ShowDialog();
                        this.Show();
                    }
                }
                else
                    MessageBox.Show("Đăng nhập không thành công!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }
            catch (Exception ex)
            {
                MessageBox.Show("Đăng nhập thất bại!\n" + ex, "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void btnExit_Click(object sender, EventArgs e)
        {
            DialogResult dialogResult = MessageBox.Show("Bạn có thật sự muốn thoát không?", "Thông báo", MessageBoxButtons.YesNo, MessageBoxIcon.Question);
            if (dialogResult == DialogResult.Yes)
            {
                Application.Exit();
            }
        }

        private void cbHienMK_CheckedChanged(object sender, EventArgs e)
        {
            if (cbHienMK.Checked == true)
                tbxPassword.UseSystemPasswordChar = false;
            else
                tbxPassword.UseSystemPasswordChar = true;
        }
    }
}
