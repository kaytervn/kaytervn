using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace QuanLyCongDanThanhPho
{
    public partial class fDangNhap : Form
    {
        CongDanDAO cdDAO = new CongDanDAO();

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
                CongDan cd = cdDAO.KiemTraDangNhap(tbxUserName.Text, tbxPassword.Text);
                if (cd != null)
                {
                    if (rbQuanLy.Checked == true)
                    {
                        if (cd.LoaiTK == (int)CongDan.enCD.QuanLy)
                        {
                            fQuanLy ql = new fQuanLy(cd);
                            this.Hide();
                            ql.ShowDialog();
                            this.Show();
                        }
                        else
                            MessageBox.Show("Bạn không có quyền truy cập vào quản lý!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    } 
                    else
                    {
                        fCongDan form = new fCongDan(cd);
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
                MessageBox.Show("Lỗi đăng nhập!\n" + ex.Message, "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
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
