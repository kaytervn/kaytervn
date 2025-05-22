using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Buoi07_TinhToan3
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
            txtSo2.Enter += txtSo2_Enter;
            txtSo1.Enter += txtSo1_Enter;
            this.MaximizeBox = false;
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            txtSo1.Text = txtSo2.Text = "0";
            radCong.Checked = true;             // Đầu tiên chọn phép cộng
        }

        private void btnThoat_Click(object sender, EventArgs e)
        {
            DialogResult dr;
            dr = MessageBox.Show("Bạn có thực sự muốn thoát không?",
                                 "Thông báo", MessageBoxButtons.YesNo);
            if (dr == DialogResult.Yes)
                this.Close();
        }

        private void btnTinh_Click(object sender, EventArgs e)
        {
            double so1, so2, kq = 0;

            // Kiểm tra ô nhập thứ nhất
            if (string.IsNullOrWhiteSpace(txtSo1.Text))
            {
                MessageBox.Show("Vui lòng nhập giá trị cho ô thứ nhất", "Lỗi", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            // Kiểm tra ô nhập thứ hai
            if (string.IsNullOrWhiteSpace(txtSo2.Text))
            {
                MessageBox.Show("Vui lòng nhập giá trị cho ô thứ hai", "Lỗi", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            // Kiểm tra xem giá trị nhập có phải là số hợp lệ không
            if (!double.TryParse(txtSo1.Text, out so1))
            {
                MessageBox.Show("Giá trị ô thứ nhất không hợp lệ", "Lỗi", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            if (!double.TryParse(txtSo2.Text, out so2))
            {
                MessageBox.Show("Giá trị ô thứ hai không hợp lệ", "Lỗi", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            // Thực hiện phép tính dựa vào phép toán được chọn
            if (radCong.Checked) kq = so1 + so2;
            else if (radTru.Checked) kq = so1 - so2;
            else if (radNhan.Checked) kq = so1 * so2;
            else if (radChia.Checked)
            {
                if (so2 != 0)
                {
                    kq = so1 / so2;
                }
                else
                {
                    MessageBox.Show("Không thể chia cho 0", "Lỗi", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    return;
                }
            }

            
            txtKq.Text = kq.ToString();
        }

        private void txtSo2_Enter(object sender, EventArgs e)
        {
            txtSo2.SelectAll();
        }

        private void txtSo1_Enter(object sender, EventArgs e)
        {
            txtSo1.SelectAll();
        }
    }
}
